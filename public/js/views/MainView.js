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
            var loop, curItem, queuedLoop, parentLoop;
            while(queue.length) {
                loop = null;
                curItem = queue.pop();
                queuedLoop = loops.length && loops[loops.length - 1];
                parentLoop = loops.length && loops[loops.length - 2];

                console.log(curItem.segment);
                console.log(JSON.stringify(loops));
                //: direct child of a table
                if (curItem.loop === 'None' && curItem.parent_loop_pos === 'n/a') {
                    console.log('a');
                    this.popAppend(loops, curTable);
                    curTable.collection[curItem.segment] = this.buildSegment(curItem);
                    //: safe to pop any queued item in `loops` as we are outside any nesting
                //: segment is in a loop but not a nested loop
                } else if (curItem.loop !== 'None' && curItem.parent_loop_pos === 'n/a') {
                    console.log('b');
                    //:  current queuedLoop is the current items parent
                    if (queuedLoop && queuedLoop.initiator === curItem.loop) {
                    console.log('b-1');
                        queuedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                    //: else if the parentLoop is the matching loop then attach to the parentLoop
                    //: and pop the queuedLoop
                    } else if (queuedLoop && parentLoop && parentLoop.initiator === curItem.loop) {
                    console.log('b-2');
                        parentLoop.collection[curItem.segment] = this.buildSegment(curItem);
                        //: we pop the queuedLoop because we are no longer under the scope of that loop
                        loops.pop();
                    //: else create a loop
                    } else {
                    console.log('b-3');
                        loop = this.buildLoop(curItem);
                        if (queuedLoop && loop.parentPosNo !== queuedLoop.posNo) {
                            this.popAppend(loops, curTable);
                        }
                        loop.collection[curItem.segment] = this.buildSegment(curItem);
                        loops.push(loop); 
                    }
                //: segment is in a loop but the loop is also nested to a parent loop
                } else if (curItem.loop !== 'None' && curItem.parent_loop_pos !== 'n/a') {
                    console.log('c');
                    //: attach to the parent if they are under the same loop
                    if (queuedLoop && queuedLoop.initiator === curItem.loop) {
                    console.log('c-1');
                        queuedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                        if (!queue.length) {
                            loops.pop();
                        }
                    //: create a new loop and push it to the queue
                    } else {
                        var nestedLoop = this.buildLoop(curItem);
                        console.log(nestedLoop);
                        if (nestedLoop.parentPosNo === queuedLoop.posNo) {
                            console.log('c-1-a');
                            queuedLoop.collection[nestedLoop.fullName] = nestedLoop;
                            nestedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                            loops.push(nestedLoop);
                        } else {
                            console.log('c-1-b');
                            parentLoop.collection[nestedLoop.fullName] = nestedLoop;
                            nestedLoop.collection[curItem.segment] = this.buildSegment(curItem);
                            //: pop the queuedLoop because we are starting a new loop under the same
                            //: parent(they are true siblings);
                            loops.pop();
                            loops.push(nestedLoop);
                        }
                    }
                }
            }
                while (loops.length) {
                    queuedLoop = loops.length && loops[loops.length - 1];
                    parentLoop = loops.length && loops[loops.length - 2];
                    if (queuedLoop && parentLoop && queuedLoop.parentPosNo === parentLoop.posNo) {
                        loops.pop();
                    } else {
                        this.popAppend(loops, curTable); 
                    }
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
