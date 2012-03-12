var _ = require('underscore')._;
var db = require('../database');
var pgClient = db.pgClient;

exports.buildDocLevelSchema = function(data) {
    var tsets = {}; //: root
    var tsetName = data[0].document;
    tsets['TS_' + tsetName] = { name: tsetName, fullName: 'TS_' + tsetName, collection: {} };
    var tables = _.uniq(_.pluck(data, 'doc_table'));
    _.each(tables, function(value) {
        var tableName = 'Table_' + value;
        var curTable = { name: tableName, fullName: tableName, collection: {} };
        var curTableSegments = _.filter(data, function(segment) {
            return segment.doc_table == value;
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
    var segments = [];
    var loop, curItem, lookahead, queuedLoop, segment;
    var getQueuedLoop = function(offset) {
        return loops[loops.length - (1 + (_.isNumber(offset) ? offset : 0))];
    };
    var getQueuedSegment = function(offset) {
        return segments[segments.length - (1 + (_.isNumber(offset) ? offset : 0))];
    };
    while(queue.length) {
        loop = null;
        segment = null;
        queuedLoop = getQueuedLoop();
        queuedSegment = getQueuedSegment();
        curItem = queue.pop();
        lookahead = queue[queue.length - 1];

        if (queuedSegment && curItem.segment === queuedSegment.name) {
            queuedSegment.collection[curItem.segment + (String(curItem.ref).length < 2 ? '0' + curItem.ref : curItem.ref)] = {};
            var item = queue && queue.length && queue[queue.length - 1];
            if (item && item.segment !== curItem.segment) {
                segments.pop();
            }
        } else {
            if (curItem.loop === 'None' && curItem.parent_loop_pos === 'n/a') {
                segment = this.buildSegment(curItem);
                segments.push(segment);
                curTable.collection[segment.fullName] = segment;
            } else if (curItem.loop !== 'None'  && curItem.parent_loop_pos === 'n/a') {
                if (queuedLoop && queuedLoop.initiator === curItem.loop) {
                    segment = this.buildSegment(curItem);
                    segments.push(segment);
                    queuedLoop.collection[segment.fullName] = segment;
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                } else {
                    loop = this.buildLoop(curItem);
                    segment = this.buildSegment(curItem);
                    segments.push(segment);
                    loop.collection[segment.fullName] = segment;
                    curTable.collection[loop.fullName] = loop;
                    loops.push(loop);
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                }
            } else {
                if (queuedLoop.initiator === curItem.loop) {
                    segment = this.buildSegment(curItem);
                    segments.push(segment);
                    queuedLoop.collection[segment.fullName] = segment;
                    this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                } else if (queuedLoop.posNo === curItem.parent_loop_pos) {
                    if (queuedLoop.initiator === curItem.loop) {
                        segment = this.buildSegment(curItem);
                        segments.push(segment);
                        queuedLoop.collection[segment.fullName] = segment;
                        this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                    } else {
                        loop = this.buildLoop(curItem);
                        segment = this.buildSegment(curItem);
                        segments.push(segment);
                        loop.collection[segment.fullName] = segment;
                        queuedLoop.collection[loop.fullName] = loop;
                        loops.push(loop);
                        this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                    }
                } else {
                    loops.pop();
                    loop = this.buildLoop(curItem);
                    segment = this.buildSegment(curItem);
                    segments.push(segment);
                    loop.collection[segment.fullName] = segment;
                    //: keep on popping the loops array until we find the parent.
                    //: we usually need to do this if we just exited deeply nested loops.
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
    //TODO fix logic here
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

exports.popAppend = function(popTarget, appendTarget) {
    var dequeuedItem = popTarget.pop();
    if (dequeuedItem) {
        appendTarget.collection[dequeuedItem.fullName] = dequeuedItem;
    }
};

exports.buildSegment = function(curItem) {
    var segment = {
        name: curItem.segment,
        fullName: curItem.segment + '_' + curItem.pos_no,
        posNo: curItem.pos_no,
        maxOccurs: curItem.max_count,
        req: curItem.req_des,
        collection: {
        }
    };
    segment.collection[curItem.segment + '0' + curItem.ref] = {};
    return segment;
};

exports.buildLoop = function(curItem) {
    return {
        name: 'Loop_' + curItem.segment,
        fullName: 'Loop_' + curItem.segment + '_' + curItem.pos_no,
        posNo: curItem.pos_no,
        initiator: curItem.loop,
        parentPosNo: curItem.parent_loop_pos,
        maxOccurs: curItem.loop_rep,
        collection: {}
    };
};


