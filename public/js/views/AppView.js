define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var SegmentModel = require('models/SegmentModel');
    var ShippingTreeView = require('views/ShippingTreeView');
    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var AppView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mainPanel = new Backbone.View({
                tagName: 'div', id: 'main-panel', className: 'row'
            }).render();
            this.itemTree = new ShippingTreeView({
                tagName: 'div', id: 'item-tree', className: 'tree-panel span4'
            });
            this.shipTree = new ShippingTreeView({
                tagName: 'div', id: 'ship-tree', className: 'tree-panel span4'
            }).render();
			this.itemTree.$ul
				.sortable({ 
					helper: 'clone', placeholder: 'ui-state-highlight',
					handle: '.handle', start: function(e, ui) {
						var selectedSiblings = $(ui.item).siblings('.ui-selected');
						console.log('selected==');
						console.log(selectedSiblings);
					}
				})
				.selectable();
            this.itemTree.segments.fetch({ success: this.itemTree.render });
            var shipmentHL = new SegmentModel();
            shipmentHL.segments = new SegmentsCollection();
            this.shipTree.segments.add(shipmentHL);
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
