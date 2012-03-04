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
                //: if not part of a loop directly attach to the table
                if (curItem.parent_loop_pos === 'n/a' && curItem.loop === 'None') {
                    //: meeting the conditions on the above if statement means
                    //: it is safe to dequeue the last loop if any exists because we
                    //: are now outside any nesting and the curItem is directly
                    //: under the table.
                    this.popAppend(loops, curTable);
                    curTable.collection[curItem.segment] = this.buildSegment(curItem);
                //: else if under a loop
                } else if (curItem.parent_loop_pos === 'n/a') {
                    var curLoop = loops[loops.length - 1];
                    //: check if a loop exists
                    if (curLoop) {
                        if (curLoop.initiator === curItem.loop) {
                            curLoop.collection[curItem.segment] = this.buildSegment(curItem);
                        }
                    //: else create the loop
                    } else {
                        var loop = this.buildLoop(curItem);
                        //: the loop initiator also needs to have an entry
                        //: inside the loop (ex. N1 segment inside Loop_N1
                        loop.collection[curItem.segment] = this.buildSegment(curItem);
                        loops.push(loop); 
                    }
                } else {
                    this.popAppend(loops, curTable);
                }
            }
        },

        popAppend: function(popTarget, appendTarget) {
            var dequeuedItem = popTarget.pop();
            if (dequeuedItem) {
                appendTarget.collection[dequeuedItem.name] = dequeuedItem;
            }
        },

        buildSegment: function(curItem) {
            return {
                name: curItem.segment,
                posNo: curItem.pos_no,
                maxOccurs: curItem.max_count
            };
        },

        buildLoop: function(curItem) {
            return {
                name: 'Loop_' + curItem.segment,
                posNo: curItem.pos_no,
                initiator: curItem.segment,
                maxOccurs: curItem.loop_rep,
                collection: {}
            };
        }
    });

    return MainView;
});
