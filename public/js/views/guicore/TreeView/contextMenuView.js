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
            spec.event.stopPropagation();
            this.$el.empty();
            //: call hide ahead of replacing the old cached view
            //: this makes sure that we can reset the old cached view's state
            //: if needed.
            this.hide();
            this._cachedView = spec.context;
            var template = Handlebars.compile(this.template);
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
