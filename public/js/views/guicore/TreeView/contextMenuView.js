define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ContextMenuTemplate = require('text!templates/ContextMenu.html');

    var contextMenuView = Backbone.View.extend({
        tagName: 'div',
        id: 'context-menu',
        className: 'context-menu',
        template: ContextMenuTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render', '_onMouseDown', 'hide');
            this.$body = $('body').on('mousedown', this._onMouseDown);
            this._isVisible = false;
            this._cachedView = null;
        },

        render: function(spec) {
            this.$el.empty();
            this.hide();
            var template = Handlebars.compile(this.template);
            this._cachedView = spec.context;
            spec.context.$el.css({ 'border-color': 'blue' });
            this.isVisible = true;
        },

        hide: function() {
            if (this._cachedView) {
                this._cachedView.$el.css({ 'border-color': 'black' });
            }
            this._cachedView = null;
        },

        _onMouseDown: function(e) {
            if (this.isVisible) { 
                this.hide();
                this.isVisible = false;
            }
        }
    });

    return new contextMenuView();
});
