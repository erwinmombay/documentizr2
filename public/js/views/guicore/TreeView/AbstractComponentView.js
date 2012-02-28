/**
 * views/TreeView/guicore/AbstractComponent.js
 * ~~~~~~~~~~~~~~~~~~~
 * AbstractComponent
 *
 * @author erwin.mombay
 */

define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //: AbstractComponent should not be instantiated.
    //: I had originally put a guard on the initialize method to throw
    //: an Error if anybody tried to initialize the class but in doing so
    //: the classes inheriting from AbstractComponent like CompositeComponent
    //: needs to rebind all the inherited methods using _.bindAll for it to work
    //: properly(which is a pain). I think it is better to sacrifice the guard
    //: so that we can call super() on AbstractComponent for it to do the binding
    //: on its initialize for the inheriting class. We use the `Abstract` naming
    //: convention to convey to the users/developers that AbstractComponent is not
    //: intended to be initialized. 
    //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var AbstractComponentView = Backbone.View.extend({
        tagName: 'li',
        
        //: tvc is an abbreviation for tree-view-component
        className: 'tvc',

        events: {
            'dblclick': '_onDoubleClick',
            'mousedown': '_onMouseDown'
        },

        constructor: function(options) {
            //: we make our own constructor so that we can assign
            //: the object specifier before `initialize` is called. sometimes
            //: we create conditions inside the initialize that relies on properties
            //: passed to the object specifier. (ex. contextMenu object)
            _.each(options, function(value, key) {
                if (!this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
            return Backbone.View.apply(this, arguments);
        },

        initialize: function() {
            _.bindAll(this, '_onDoubleClick', '_onDrop', '_onHoverEnter', '_onHoverExit', '_onMouseDown'
                /*'droppable', 'sortable', 'selectable',*/);
            this.observer = { trigger: function() { /** no op **/ } };
            //: _type is used for namspacing the trigger events. ex. `doubleClick:composite`
            this._type = 'component';
            if (this.contextMenu) {
                var that = this;
                //: doing a return false on the on.contextmenu event
                //: prevents the default browser's contextmenu to pop up
                this.$el.on('contextmenu', function(e) {
                    that.contextMenu.render({ viewContext: that, event: e });
                    return false; 
                });
            }
        },

        _onDoubleClick: function(e) {
            this.observer.trigger('doubleClick:' + this._type, { viewContext: this, event: e });
            this.observer.trigger('doubleClick', { viewContext: this, event: e });
        },

        _onDrop: function(e, ui) {
            this.observer.trigger('drop:' + this._type, { viewContext: this, event: e, ui: ui });
            this.observer.trigger('drop', { viewContext: this, event: e, ui: ui });
        },

        _onHoverEnter: function(e, ui) {
            this.observer.trigger('hoverEnter:' + this._type, { viewContext: this, event: e, ui: ui });
            this.observer.trigger('hoverEnter', { viewContext: this, event: e, ui: ui });
        },

        _onHoverExit: function(e, ui) {
            this.observer.trigger('hoverExit:' + this._type, { viewContext: this, event: e, ui: ui });
            this.observer.trigger('hoverExit', { viewContext: this, event: e, ui: ui });
        },

        _onMouseDown: function(e) {
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: Doing an event.stopPropagation() onmousedown causes $.selectable
            //: behavior to not trigger. Because of this our onmousedown sentinels are a little ugly
            //: and complicated. We make sure that the current event.target dom `is` this view.$el
            //: or tvc-container(by doing $target.parent().is(this.$el)) 
            //: or one of the dom elements under tvc-container(by doing $target.parent().parent().is(this.$el)).
            //: WARNING: if ever the standard composite and leaf html templates are changed, this
            //: sentinel/conditional might need to be updated to get the desired leftclick event.
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: 1 is a mouse left click event.
            var $target = $(e.target);
            if (e.which == 1 && ($(e.target).is(this.$el) || $(e.target).parent().is(this.$el) ||
                $(e.target).parent().parent().is(this.$el))) {
                    this.observer.trigger('leftClick:' + this._type, { viewContext: this, event: e });
                    this.observer.trigger('leftClick', { viewContext: this, event: e });
            //: 3 is a mouse right click event
            } else if (e.which == 3 && ($target.is(this.$el) || $target.parent().is(this.$el) ||
                       $target.parent().parent().is(this.$el))) {
                           //: when rightClick viewContext menu is turned on, we stop propagation since
                           //: the singleton contextMenuView attaches a mousedown listener to the body
                           //: that makes the contextMenuView clear/hide itself when its current state `isVisible`
                           this.observer.trigger('rightClick:' + this._type, { viewContext: this, event: e });
                           this.observer.trigger('rightClick', { viewContext: this, event: e });
            //: 2 is a middle click event
            } else if (e.which == 2 && ($target.is(this.$el) || $target.parent().is(this.$el) ||
                       $target.parent().parent().is(this.$el))) {
                           this.observer.trigger('middleClick:' + this._type, { viewContext: this, event: e });
                           this.observer.trigger('middleClick', { viewContext: this, event: e });
            }
        }
    });

    return AbstractComponentView;
});


