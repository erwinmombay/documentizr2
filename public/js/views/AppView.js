define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var SegmentModel = require('models/SegmentModel');
    var TreeView = require('views/TreeView');

    var AppView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'render');
            this.mainPanel = new Backbone.View({
                tagName: 'div',
                id: 'main-panel',
                className: 'row span4 tree-view'
            }).render();
            this.itemTree = new EDITreeView({
                tagName: 'ul',
                id: 'item-tree-panel',
                className: 'tree-panel'
            }).render();
            this.shipTree = new EDITreeView({
                tagName: 'div',
                id: 'ship-tree-panel'
            }).render();
            $(this.itemTree.el).sortable();
        },

        render: function() {
            $(this.el).append(this.mainPanel.el);
            $(this.mainPanel.el).append(this.itemTree.el);
            $(this.mainPanel.el).append(this.shipTree.el);
            return this;
        }
    });
    return AppView;
});

