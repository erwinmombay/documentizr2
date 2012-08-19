var _ = require('underscore')._;
var db = require('../database');
var pgClient = db.pgClient;

exports.buildDocLevelSchema = function(data) {
    var alias = { 'Table_1': 'Header', 'Table_2': 'Detail', 'Table_3': 'Summary' };
    var tsets = {}; //: root
    var tsetName = data[0].document;
    tsets['TS_' + tsetName] = { name: tsetName, fullName: 'TS_' + tsetName, collection: {} };
    var tables = _.uniq(_.pluck(data, 'doc_table'));
    _.each(tables, function(value) {
        var tableName = 'Table_' + value;
        var curTable = { name: alias[tableName], fullName: tableName, collection: {} };
        var curTableSegments = _.filter(data, function(segment) {
            return segment.doc_table === value;
        }, this);
        this.buildTableLevelSchema(curTable, curTableSegments);
        tsets['TS_' + tsetName].collection[tableName] = curTable;
    }, this);
    return tsets;
};

exports.buildTableLevelSchema = function(curTable, curTableSegments) {
    //: make a copy of the original array and reverse the order
    var queue = curTableSegments.slice(0).reverse();
    //: push any loop object we create to this array so we can
    //: keep appending to it for any segment that is a part of the loop
    var loops = [];
    var curSegment = null;
    var loop, curItem, lookahead, queuedLoop, segment;
    var getQueuedLoop = function(offset) {
        return loops[loops.length - (1 + (_.isNumber(offset) ? offset : 0))];
    };
    while(queue.length) {
        loop = null;
        queuedLoop = getQueuedLoop();
        curItem = queue.pop();
        lookahead = queue[queue.length - 1];

        if (curSegment && curItem.segment === curSegment.name) {
            curSegment.collection[curItem.segment +
                                  (String(curItem.ref).length < 2 ? '0' + curItem.ref : curItem.ref)
                                 ] = this.buildElement(curItem);
            if (lookahead && lookahead.segment !== curItem.segment) {
                curSegment = null;
            }
            this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
        } else {
            curSegment = null;
            //: is under table and not part of any loop
            if (curItem.loop === 'None' && curItem.parent_loop_pos === 'n/a') {
                segment = this.buildSegment(curItem);
                curSegment = segment;
                curTable.collection[segment.fullName] = segment;
            //: under table but part of a loop
            } else if (curItem.loop !== 'None'  && curItem.parent_loop_pos === 'n/a') {
                //: current queuedLoops initiator matches the current rows loop(loop parent)
                if (queuedLoop && queuedLoop.initiator === curItem.loop) {
                    segment = this.buildSegment(curItem);
                    curSegment = segment;
                    queuedLoop.collection[segment.fullName] = segment;
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                //: loop does not exist create a loop and attach this segment
                } else {
                    loop = this.buildLoop(curItem);
                    segment = this.buildSegment(curItem);
                    curSegment = segment;
                    loop.collection[segment.fullName] = segment;
                    curTable.collection[loop.fullName] = loop;
                    loops.push(loop);
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                }
            //: not under table and is part of a loop (nested loops)
            } else {
                //: item belongs to the current queuedLoop 
                if (queuedLoop.initiator === curItem.loop) {
                    segment = this.buildSegment(curItem);
                    curSegment = segment;
                    queuedLoop.collection[segment.fullName] = segment;
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                //: create a new loop, this is a nested loop since its parent loop pos
                //: is the posNo of the queuedLoop
                } else if (queuedLoop.posNo === curItem.parent_loop_pos) {
                    loop = this.buildLoop(curItem);
                    segment = this.buildSegment(curItem);
                    curSegment = segment;
                    loop.collection[segment.fullName] = segment;
                    queuedLoop.collection[loop.fullName] = loop;
                    loops.push(loop);
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                //: else it is a nested loop but the current queuedLoop is not its parent.
                //: pop the loops queue repeatedly until we find its parent.
                } else {
                    loops.pop();
                    loop = this.buildLoop(curItem);
                    segment = this.buildSegment(curItem);
                    curSegment = segment;
                    loop.collection[segment.fullName] = segment;
                    //: keep on popping the loops array until we find the parent.
                    while (loops.length) {
                        queuedLoop = getQueuedLoop();
                        if (queuedLoop.posNo === loop.parentPosNo) {
                            queuedLoop.collection[loop.fullName] = loop;
                            loops.push(loop);
                            break;
                        }
                        loops.pop();
                    }
                }
            }
        }
    }
};

exports.checkIfLoopsArrayShouldPop = function(lookahead, loopsArray, queue) {
    if (!this.isNextItemInScope(lookahead, loopsArray)) {
        loopsArray.pop();
    //: else if the queue has been depleted
    } else if (queue.length === 0) {
        loopsArray.pop();
    }
};

/**
 * checks the `lookahead` if it is still part of the scope of the `queuedLoop`
 * wether it be a part of the same loop or actually a child/nested loop
 */
exports.isNextItemInScope = function(lookahead, loopsArray) {
    //: TODO fix logic here. reexamine this section. seems to work but we can probably
    //: make it cleaner
    var queuedLoop = loopsArray.length && loopsArray[loopsArray.length - 1];
    if (lookahead && queuedLoop && lookahead.loop !== queuedLoop.initiator) {
        //: if it actually is a child scope then return true
        if (lookahead.parent_loop_pos === queuedLoop.posNo) {
            return true;
        }
        return false;
    }
    return true;
};

exports.buildSegment = function(curItem) {
    var segment = {
        name: curItem.segment,
        fullName: curItem.segment + '_' + curItem.pos_no,
        posNo: curItem.pos_no,
        maxOccurs: curItem.max_count,
        req: curItem.req_des,
        nodeType: 's',
        collection: {}
    };
    segment.collection[curItem.segment + '01']  = this.buildElement(curItem);
    return segment;
};

exports.buildElement = function(curItem) {
    return {
        name: curItem.element_name,
        fullName: curItem.segment + (String(curItem.ref).length < 2 ? '0' + curItem.ref : curItem.ref),
        req: curItem.seg_req_des,
        type: curItem.elem_type,
        nodeType: 'e'
    };
};

exports.buildLoop = function(curItem) {
    return {
        name: 'Loop_' + curItem.segment,
        fullName: 'Loop_' + curItem.segment + '_' + curItem.pos_no,
        posNo: curItem.pos_no,
        initiator: curItem.loop,
        parentPosNo: curItem.parent_loop_pos,
        maxOccurs: curItem.loop_rep,
        nodeType: 'l',
        collection: {}
    };
};


