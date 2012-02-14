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
            this.mediator.itemTree = new SegmentTreeView({
                tagName: 'div', id: 'item-tree',
                className: 'tree-panel span4'
            });
            this.mediator.shipTree = new SegmentTreeView({
                tagName: 'div', id: 'ship-tree',
                className: 'tree-panel span4'
            }).render();
			this.mediator.itemTree.$ul
				.sortable({ 
					helper: function(e, ui) {
						console.log('helper');
						//: `this` is the $ul which we add sortable to
						var selected = $(this).children('.ui-selected');
						return selected.length ?
							selected.clone().empty()
							: ui.clone().empty();
					},
					placeholder: 'ui-state-highlight',
					handle: '.handle'
				})
				.selectable();
            this.mediator.itemTree.segments.fetch({ success: this.mediator.itemTree.render });
            var shipmentHL = new SegmentModel();
            shipmentHL.segments = new SegmentsCollection();
            this.mediator.shipTree.segments.add(shipmentHL);
        },

        render: function() {
            this.$el.append(this.mediator.el);
            this.mediator.$el.append(this.mediator.itemTree.el);
            this.mediator.$el.append(this.mediator.shipTree.el);
            this.editor.render();
            this.$el.append(this.editor.el);
            this.editor.$el.modal('show');
            return this;
        }
    });
    return AppView;
});
