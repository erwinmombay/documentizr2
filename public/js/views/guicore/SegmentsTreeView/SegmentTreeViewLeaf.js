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
            this.$el.empty();
            this.$el.append(this.template);
            var text = 'leaf ' + this.model.cid + ' => ';
            text += 'qty: ' + this.model.get('qty');
            text += ' per: ' + this.model.get('per');
            this.$('.tvc-label').text(text);
            return this;
        }
    });
    return TreeViewLeaf;
});

