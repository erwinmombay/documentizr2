define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/guicore/TreeView/AbstractTreeViewComponent');

    var TreeViewLeaf = AbstractTreeViewComponent.extend({
        template: [
            '<div class="tvc-container">',
            '<span class="tvc-minus handle"></span>',
            '<span class="tvc-label"></span>',
            '</div>'
        ].join(''),

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.append(this.template);
            this.$('.tvc-label').text('leaf ' + this.model.cid);
            return this;
        }
    });
    return TreeViewLeaf;
});

