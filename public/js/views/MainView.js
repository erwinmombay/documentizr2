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
            //var $preT = $('<pre/>', { 'class': 'prettyprint' });
            //var $codeT = $('<code/>', { 'class': 'language-js' });
            //$codeT.append(JSON.stringify(bootstrapData, null, 4));
            //$('.span9').append($preT.append($codeT));
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
            //: make a copy of the original array
            var queue = curTableSegments.slice(0);
            while(queue.length) {
                //: pop the first item
                var curItem = queue.shift();
                _.each(queue, function(value) {
                    curTable.collection[curItem.segment] = {};
                    this.buildSegmentLevelSchema();
                }, this);
            }
        },

        buildSegmentLevelSchema: function(node, data) {
            
        }
    });

    return MainView;
});
