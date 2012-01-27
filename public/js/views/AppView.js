define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var SegmentModel = require('models/SegmentModel');
    var EDITreeView = require('views/EDITreeView');

    var TreeViewComposite = require('views/TreeViewComposite');
    var TreeViewLeaf = require('views/TreeViewLeaf');
    var EDITreeViewDecorator = require('utils/EDITreeViewDecorator');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var AppView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mainPanel = new Backbone.View({
                tagName: 'div', id: 'main-panel', className: 'row'
            }).render();
            this.itemTree = new EDITreeView({
                tagName: 'div', id: 'item-tree', className: 'tree-panel span4'
            });
            this.shipTree = new EDITreeView({
                tagName: 'div', id: 'ship-tree', className: 'tree-panel span4'
            }).render();
            //this.itemTree = new EDITreeViewDecorator.Sortable(this.itemTree);
            this.itemTree.$ul.sortable();
            this.itemTree.$ul.selectable();
            this.itemTree.segments.fetch({ success: this.itemTree.render });
            var newTVC = new SegmentModel();
            newTVC.segments = new SegmentsCollection();
            this.shipTree.segments.add(newTVC);
            var newTVC2 = new SegmentModel();
            newTVC2.segments = new SegmentsCollection();
            this.shipTree.segments.add(newTVC2);
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
