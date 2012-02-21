define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var contextMenuTemplate = require('text!templates/ContextMenu.html');

    var treeViewContextMenuView = Backbone.View.extend({
        tagName: 'div',
        id: 'context-menu',
        className: '',
        template: contextMenuTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render');
        },

        render: function(spec) {
            var template = Handlebars.compile(this.template);
            if (!spec) {
                this.$el.empty();
                this.$el.append(template);
                return this;
            }
        }
    });
    //: guarantees singleton
    return new treeViewContextMenuView();
});
