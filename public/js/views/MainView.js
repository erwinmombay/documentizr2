define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var ComponentModel = require('models/ComponentModel');
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentCollection = require('collections/ComponentCollection');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mediator = mediator; 
            this.doctree = new TreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView
            }).render();
            var shipmentHL = new ComponentModel({
                componentCollection: new ComponentCollection()
            });
            this.doctree.componentCollection.add(shipmentHL);
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            var $pre = $('<pre/>', { 'class': 'prettyprint' });
            var $code = $('<code/>', { 'class': 'language-js' });
            var data = this.buildDocLevelSchema(bootstrapData);
            $code.append(data);
            $('.span9').append($pre.append($code));
            return this;
        },

        buildDocLevelSchema: function(data) {
            var tsets = {}; //: root
            var tsetName = data[0].document;
            tsets[tsetName] = { name: tsetName, collection: {} };
            var tables = _.uniq(_.pluck(data, 'doc_table'));
            _.each(tables, function(value) {
                var tableName = 'Table_' + value;
                var curTable = { name: tableName, collection: {} };
                var curTableSegments = _.filter(data, function(segment) {
                    return segment.doc_table == value;
                }, this);
                this.buildTableLevelSchema(curTable, curTableSegments);
                tsets[tsetName].collection[tableName] = curTable;
            }, this);
            return JSON.stringify(tsets, null, 4);
        },
        
        buildTableLevelSchema: function(curTable, curTableSegments) {
            //: make a copy of the original array and reverse the order
            var queue = curTableSegments.slice(0).reverse();
            //: push any loop object we create to this array so we can
            //: keep appending to it for any segment that is a part of the loop
            var loops = [];

            while(queue.length) {
                var curItem = queue.pop();
                var loop = null;
                var queuedLoop = loops.length && loops[loops.length - 1];
                var siblingQueuedLoop = loops.length && loops[loops.length - 2];
                //: if not part of a loop directly attach to the table
                console.log(curItem.segment + ' ' + curItem.pos_no);
                if (curItem.parent_loop_pos === 'n/a' && curItem.loop === 'None') {
                    console.log('1');
                    //: meeting the conditions on the above if statement means
                    //: it is safe to dequeue the last loop if any exists because we
                    //: are now outside any nesting and the curItem is directly
                    //: under the table.
                    this.popAppend(loops, curTable);
                    curTable.collection[curItem.segment] = this.buildSegment(curItem);
                //: else if under a loop
                } else if (curItem.parent_loop_pos === 'n/a' && curItem.loop !== 'None') {
                    console.log('2');
                    //: check if a loop exists
                    if (queuedLoop) {
                        console.log('2-a');
                        if (queuedLoop.initiator === curItem.loop) {
                            console.log('2-a-1');
                            queuedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                            queuedLoop = null;
                        } else {
                            console.log(queuedLoop);
                            console.log(siblingQueuedLoop);
                            if (queuedLoop && siblingQueuedLoop && curItem.loop === siblingQueuedLoop.initiator) {
                            console.log('2-a-2');
                                siblingQueuedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                                loops.pop();
                            } else {
                            console.log('2-a-3');
                            loop = this.buildLoop(curItem);
                            loop.collection[curItem.segment] = this.buildSegment(curItem);
                            this.popAppend(loops, curTable);
                            loops.push(loop); 
                            loop = null;
                            }
                        }
                    } else {
                    console.log('2-b');
                        loop = this.buildLoop(curItem);
                        loop.collection[curItem.segment] = this.buildSegment(curItem);
                        loops.push(loop);
                        loop = null;
                    }
                } else if (queuedLoop && curItem.parent_loop_pos == queuedLoop.posNo) {
                    console.log('3-a');
                    var nestedLoop = this.buildLoop(curItem);
                    console.log(JSON.stringify(nestedLoop));
                    queuedLoop.collection[nestedLoop.fullName] = nestedLoop;
                    nestedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                    loops.push(nestedLoop);
                    queuedLoop = null;
                } else {
                    console.log('4');
                    if (queuedLoop && siblingQueuedLoop && queuedLoop.parentPosNo === siblingQueuedLoop.posNo &&
                        curItem.loop === queuedLoop.initiator) {
                            console.log('4-a');
                            queuedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                            queuedLoop = null;
                    } else if (queuedLoop && siblingQueuedLoop && queuedLoop.parentPosNo === siblingQueuedLoop.posNo) {
                        console.log('4-b');
                        this.popAppend(loops, siblingQueuedLoop);
                    } else {
                        this.popAppend(loops, curTable); 
                    }
                }
            }
            //: attach the main loop under a table(if it exists) when the queue is exhausted
            if (loops.length) {
                this.popAppend(loops, curTable); 
            }
        },

        popAppend: function(popTarget, appendTarget) {
            var dequeuedItem = popTarget.pop();
            if (dequeuedItem) {
                console.log('popping ' + dequeuedItem.fullName + ' append to ' + appendTarget.name);
                appendTarget.collection[dequeuedItem.fullName] = dequeuedItem;
            }
        },

        buildSegment: function(curItem) {
            return {
                name: curItem.segment,
                fullName: curItem.segment + '_' + curItem.pos_no,
                posNo: curItem.pos_no,
                maxOccurs: curItem.max_count
            };
        },

        buildLoop: function(curItem) {
            return {
                name: 'Loop_' + curItem.segment,
                fullName: 'Loop_' + curItem.segment + '_' + curItem.pos_no,
                posNo: curItem.pos_no,
                initiator: curItem.segment,
                parentPosNo: curItem.parent_loop_pos,
                maxOccurs: curItem.loop_rep,
                collection: {}
            };
        }
    });

    return MainView;
});
