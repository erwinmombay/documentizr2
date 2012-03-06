define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    return {

        buildDocLevelSchema: function(data) {
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
        },
        
        buildTableLevelSchema: function(curTable, curTableSegments) {
            //: make a copy of the original array and reverse the order
            var queue = curTableSegments.slice(0).reverse();
            //: push any loop object we create to this array so we can
            //: keep appending to it for any segment that is a part of the loop
            var loops = [];
            var loop, curItem, lookahead, queuedLoop;
            var getQueuedLoop = function(offset) {
                return loops[loops.length - (1 + (_.isNumber(offset) ? offset : 0))];
            };
            while(queue.length) {
                loop = null;
                queuedLoop = getQueuedLoop();
                curItem = queue.pop();
                lookahead = queue[queue.length - 1];

                //console.log(curItem.segment + '_' + curItem.pos_no);
                //: direct child of a table
                if (curItem.loop === 'None' && curItem.parent_loop_pos === 'n/a') {
                    //console.log('a');
                    curTable.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                //: segment is in a loop but not a nested loop
                } else if (curItem.loop !== 'None'  && curItem.parent_loop_pos === 'n/a') {
                    //console.log('b');
                    if (queuedLoop && queuedLoop.initiator === curItem.loop) {
                    //console.log('b-1');
                        queuedLoop.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                        this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                    } else {
                    //console.log('b-2');
                        loop = this.buildLoop(curItem);
                        loop.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                        curTable.collection[loop.fullName] = loop;
                        loops.push(loop); 
                        this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                    }
                //: else this item must be part of a nested loop
                } else {
                    //console.log('c');
                    if (queuedLoop.initiator === curItem.loop) {
                        //console.log('c-333');
                        queuedLoop.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                        this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                    } else if (queuedLoop.posNo === curItem.parent_loop_pos) {
                        //console.log('c-1');
                        if (queuedLoop.initiator === curItem.loop) {
                        //console.log('c-1-a');
                            queuedLoop.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                            this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                        } else {
                            //console.log('c-1-b');
                            loop = this.buildLoop(curItem);
                            loop.collection[curItem.segment + '_' + curItem.pos_no] = this.buildSegment(curItem);
                            queuedLoop.collection[loop.fullName] = loop;
                            loops.push(loop);
                            this.checkIfLoopsArrayShouldPop(lookahead, loops, queue);
                        }
                    } else {
                        //console.log('c-2');
                        loops.pop();
                        loop = this.buildLoop(curItem);
                        loop.collection[curItem.segment] = this.buildSegment(curItem);
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
        },

        checkIfLoopsArrayShouldPop: function(lookahead, loopsArray, queue) {
            if (!this.isNextItemInScope(lookahead, loopsArray)) {
                //console.log('t');
                loopsArray.pop();
            //: else if the queue has been depleted popAppend to table
            } else if (queue.length === 0) {
                //console.log('t-a');
                loopsArray.pop();
            }
        },
        
        /**
         * checks the `lookahead` if it is still part of the scope of the `queuedLoop`
         * wether it be a part of the same loop or actually a child/nested loop
         */
        isNextItemInScope: function(lookahead, loopsArray) {
            //TODO fix logic here
            var queuedLoop = loopsArray.length && loopsArray[loopsArray.length - 1];
            if (lookahead && queuedLoop && lookahead.loop !== queuedLoop.initiator) {
                //: if it actually is a child scope then return true
                if (lookahead.parent_loop_pos === queuedLoop.posNo) {
                    //console.log('z');
                    return true;
                }
                //console.log('x');
                return false;
            }
            //console.log('w');
            return true;
        },

        popAppend: function(popTarget, appendTarget) {
            var dequeuedItem = popTarget.pop();
            if (dequeuedItem) {
                appendTarget.collection[dequeuedItem.fullName] = dequeuedItem;
            }
        },

        buildSegment: function(curItem) {
            return {
                name: curItem.segment,
                fullName: curItem.segment + '_' + curItem.pos_no,
                posNo: curItem.pos_no,
                maxOccurs: curItem.max_count,
                req: curItem.req_des
            };
        },

        buildLoop: function(curItem) {
            return {
                name: 'Loop_' + curItem.segment,
                fullName: 'Loop_' + curItem.segment + '_' + curItem.pos_no,
                posNo: curItem.pos_no,
                initiator: curItem.loop,
                parentPosNo: curItem.parent_loop_pos,
                maxOccurs: curItem.loop_rep,
                collection: {}
            };
        }
    };
});
