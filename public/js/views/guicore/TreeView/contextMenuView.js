define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var contextMenuView = Backbone.View.extend({
        tagName: 'div',
        id: 'cmenu',
        className: 'cmenu',
        isVisible: false,
        _cachedTargetView: null,

        initialize: function(options) {
            _.bindAll(this, 'render', '_onMouseDown', 'hide', 'createMenuOptions');
            this.$body = $('body').on('mousedown', this._onMouseDown);
            //: we append to the body so and not on the contextView
            //: so that we only need to append once
            this.$body.append(this.$el.hide());
            this.$options = $('<ul/>', { 'class': 'cmenu-options' });
            this.$el.append(this.$options);
        },

        render: function(spec) {
            //: doing a return false on the on.contextmenu event
            //: prevents the default browser's contextmenu to pop up
            spec.viewContext.$el.on('contextmenu', function(e) {
                return false; 
            });
            //: stopPropagation() here to prevent $body triggering an
            //: onmousedown which causes the contextmenu(when we want to show it)
            //: to be hidden
            spec.event.stopPropagation();
            //: call hide ahead of replacing the old cached view
            //: this makes sure that we can reset the old cached view's state
            //: if needed.
            this.$el.hide(spec.event);
            this.$options.empty();
            this._cachedTargetView = spec.viewContext;
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
        },

        hide: function(e) {
            if (this._cachedTargetView) {
                this.$el.hide();
                this.isVisible = false;
            }
            this._cachedTargetView = null;
        },

        _onMouseDown: function(e) {
            if (this.isVisible) { 
                this.hide(e);
            }
        },

        createMenuOptions: function(menuObj) {
            _.each(menuObj, function(value, key) {
                var $listItem = $('<li/>');
                var $link = $('<a/>', { 'href': '#', 'text': key});
                $link.on('mousedown', function(e) {
                    if (e.which == 1) {
                        //: value should be the callback
                        value(e);
                    }
                });
                this.$options.append($listItem.append($link));
            }, this);
        }
    });
    
    //: assures that contextMenuView is a singleton
    return new contextMenuView();
});
