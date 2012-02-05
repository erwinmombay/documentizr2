define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/guicore/TreeView/AbstractTreeViewComponent');
    var leafTemplate = require('text!templates/TreeView/LeafTemplate.html');

    var TreeViewLeaf = AbstractTreeViewComponent.extend({
        template: leafTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            var template = Handlebars.compile(this.template); 
            this.$el.append(template({
                leaf: this.model.cid,
                qty: this.model.get('qty'),
                per: this.model.get('per')
            }));
            return this;
        }
    });
    return TreeViewLeaf;
});

