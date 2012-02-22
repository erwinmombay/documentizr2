define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var modalEditorView = require('views/modalEditorView');
    var ComponentModel = require('models/ComponentModel');
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentCollection = require('collections/ComponentCollection');

    var AppView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mediator = mediator;
            this.mediator.itemTree = new TreeView({
                tagName: 'div', id: 'item-tree', className: 'tree-panel span4'
            });
            this.mediator.shipTree = new TreeView({
                tagName: 'div', id: 'ship-tree', className: 'tree-panel span4',
                observer: this.mediator
            }).render();
			this.mediator.itemTree.$componentCollection
				.sortable({ 
					placeholder: 'ui-state-highlight',
					handle: '.handle',
                    start: function(e, ui) {
                        var children = $(this).children('.ui-selected');
                        var areItemsDraggedSelected = _.any(children, function(value) {
                            return $(value).attr('id') === $(ui.item).attr('id');
                        });
                        //: TODO fix cancel operation. this doesnt work atm.
                        if (!areItemsDraggedSelected) {
                            $(ui).sortable('cancel');
                        }
                    },
                    //: we create our own helper to allow for multiple select and
                    //: multiple dragged items to be dropped.
                    //: TODO currently only one clone is visible ondrag, try to fix this in the future
                    helper: function(e, ui) {
                        //: `this` is the $componentCollection which we add sortable to
                        var selected = $(this).children('.ui-selected');
                        return selected.length ? selected.clone().empty() : ui.clone().empty();
                    }
				})
				.selectable({ distance: 1 });
            this.mediator.itemTree.componentCollection.fetch({ success: this.mediator.itemTree.render });
            var shipmentHL = new ComponentModel();
            shipmentHL.componentCollection = new ComponentCollection();
            this.mediator.shipTree.componentCollection.add(shipmentHL);
        },

        render: function() {
            this.$el.append(this.mediator.el);
            this.mediator.$el.append(this.mediator.itemTree.el);
            this.mediator.$el.append(this.mediator.shipTree.el);
            return this;
        }
    });
    return AppView;
});
