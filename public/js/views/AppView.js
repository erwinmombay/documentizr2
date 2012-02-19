define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var modalEditorView = require('views/modalEditorView');
    var SegmentModel = require('models/SegmentModel');
    var SegmentTreeView = require('views/guicore/SegmentTreeView/SegmentTreeView');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var AppView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mediator = mediator;
            this.editor = modalEditorView;
            this.itemTree = new SegmentTreeView({
                tagName: 'div', id: 'item-tree', className: 'tree-panel span4'
            });
            this.shipTree = new SegmentTreeView({
                tagName: 'div', id: 'ship-tree', className: 'tree-panel span4',
                mediator: this.mediator
            }).render();
			this.itemTree.$ul
				.sortable({ 
					placeholder: 'ui-state-highlight',
					handle: '.handle',
                    //: we create our own helper to allow for multiple select and
                    //: multiple dragged items to be dropped.
                    //: TODO currently only one clone is visible on drag, try to fix in the future
                    helper: function(e, ui) {
                        //: `this` is the $ul which we add sortable to
                        var selected = $(this).children('.ui-selected');
                        return selected.length ?
                            selected.clone().empty() : ui.clone().empty();
                    }
				})
				.selectable({ distance: 1 });
            this.itemTree.segments.fetch({ success: this.itemTree.render });
            var shipmentHL = new SegmentModel();
            shipmentHL.segments = new SegmentsCollection();
            this.shipTree.segments.add(shipmentHL);
        },

        render: function() {
            this.$el.append(this.mediator.el);
            this.mediator.$el.append(this.itemTree.el);
            this.mediator.$el.append(this.shipTree.el);
            this.editor.render();
            return this;
        }
    });
    return AppView;
});
