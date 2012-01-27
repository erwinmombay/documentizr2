define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/AbstractTreeViewComponent');

    var TreeViewLeaf = AbstractTreeViewComponent.extend({
        tagName: 'li',

        initialize: function(options) {
            _.bindAll(this, 'render');
            $(this.el).attr('id', this.model.cid);
        },

        render: function() {
            $(this.el).append('leaf ' + this.model.cid);
            return this;
        }
    });
    return TreeViewLeaf;
});

