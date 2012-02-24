define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ContextMenuTemplate = require('text!templates/ContextMenu.html');

    var contextMenuView = Backbone.View.extend({
        tagName: 'div',
        id: 'context-menu',
        className: 'cmenu',
        template: ContextMenuTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render', '_onMouseDown', 'hide');
            this.$body = $('body').on('mousedown', this._onMouseDown);
            this._isVisible = false;
            this._cachedTargetView = null;
            //$('#ship-tree').append(this.$el);
        },

        render: function(spec) {
            var e = spec.event;
            console.log(e);
            //: stopPropagation() here to prevent $body triggering an
            //: onmousedown which causes the contextmenu to be hidden
            //: doing a return false on the on.contextmenu event
            //: prevents the default browser's contextmenu to pop up
            spec.context.$el.on('contextmenu', function(e) {
                return false; 
            });
            e.stopPropagation();
            this.$el.hide();
            this.$el.empty();
            //: call hide ahead of replacing the old cached view
            //: this makes sure that we can reset the old cached view's state
            //: if needed.
            this._cachedTargetView = spec.context;
            var template = Handlebars.compile(this.template);
            this.$el.append(template());
            this.$el.css({
                'display': '',
                'position': 'absolute',
                'z-index': '999',
                'left': e.pageX + 'px',
                'top': e.pageY + 'px',
                'height': '50px',
                'width': '50px'
            });
            //: bad idea, find somewhere to anchor on
            spec.context.$el.append(this.$el);
            console.log(this.$el);
            this.isVisible = true;
        },

        hide: function() {
            if (this._cachedTargetView) {
                this.$el.hide();
            }
            this._cachedTargetView = null;
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
