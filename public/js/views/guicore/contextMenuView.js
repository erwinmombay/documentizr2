/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';

    var contextMenuView = Backbone.View.extend({
        tagName: 'div',
        id: 'cmenu',
        className: '',
        isVisible: false,
        _cachedTargetView: null,

        initialize: function(options) {
            _.bindAll(this);
            this.$body = $('body').on('mousedown', this._onMouseDown);
            //: we append to the body so and not on the contextView
            //: so that we only need to append once
            this.$body.append(this.$el.hide());
            this.$options = $('<ul/>', { 'class': 'cmenu-options' });
            this.$el.append(this.$options);
        },

        render: function(spec) {
            //: stopPropagation() here to prevent $body triggering an
            //: onmousedown which causes the contextmenu(when we actually want to show it)
            //: to be hidden
            spec.event.stopPropagation();
            //: call hide ahead of replacing the old cached view
            //: this makes sure that we can reset the old cached view's state
            //: if needed.
            this.$el.hide(spec.event);
            this.$options.empty();
            this._cachedTargetView = spec.ctx;
            this.createMenuOptions(this._cachedTargetView.menu);
            //: recalculate position by using e.pageX/pageY
            this.$el.css({
                'display': '',
                'position': 'absolute',
                'z-index': '1000',
                'left': spec.event.pageX + 'px',
                'top': spec.event.pageY + 'px',
                'height': '350px',
                'width': '150px'
            });
            this.isVisible = true;
            return this;
        },

        hide: function(e) {
            if (this._cachedTargetView) {
                this.$el.hide();
                this.isVisible = false;
            }
            this._cachedTargetView = null;
            return this;
        },

        _onMouseDown: function(e) {
            if (this.isVisible) {
                this.hide(e);
            }
        },

        createMenuOptions: function(menuObj) {
            _.each(menuObj, this.createMenuListItems);
        },

        createMenuListItems: function(value, key) {
            var $listItem = $('<li/>');
            var $link = $('<a/>', { 'href': '#', 'text': key});
            $link.on('mousedown', function(e) {
                if (e.which == 1) {
                    //: value should be the callback
                    value(e);
                }
            });
            this.$options.append($listItem.append($link));
        }
    });
    
    //: assures that contextMenuView is a singleton
    return new contextMenuView();
});
