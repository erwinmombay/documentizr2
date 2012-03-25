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
    //: properly(which is a pain and ugly). I think it is better to sacrifice the guard
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
            //: apply _properties as identifiers/obj properties
            var _allowedProperties = [];
            //: we make our own constructor so that we can assign
            //: the object specifier before `initialize` is called. sometimes
            //: we create conditions inside the initialize that relies on properties
            //: passed to the object specifier. (ex. contextMenu object)
            _.each(options, function(value, key) {
                if (!this.hasOwnProperty(key) && _.include(_allowedProperties, key)) {
                    this[key] = value;
                }
            }, this);
            return Backbone.View.apply(this, arguments);
        },

        initialize: function(options) {
            _.bindAll(this, '_onDoubleClick', '_onDrop', '_onHoverEnter', '_onHoverExit',
                '_onMouseDown', 'droppable', 'bindEventHandlers', 'unbindEventHandlers',
                'destroy', 'clear');
            //: _type is used for namspacing the trigger events. ex. `doubleClick:composite`
            this._type = 'component';
            this.bindEventHandlers();
        },

        destroy: function() {
            this.remove();
            //: need to call trigger destroy ahead before call to `this.off()`
            this.trigger('destroy:' + this._type);
            this.unbindEventHandlers();
            this.off();
        },

        clear: function() {
            this.$el.empty();
            this.trigger('clear:' + this._type);
            return this;
        },

        bindEventHandlers: function() {
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.destroy, this);
        },

        unbindEventHandlers: function() {
            this.model.off('change', this.render, this);
            this.model.off('destroy', this.destroy, this);
        },

        droppable: function(spec) {
            var options = _.defaults(spec || {}, { drop: this._onDrop, greedy: true, accept: '.tvc', tolerance: 'pointer' });
            if (spec.hover) {
                _.defaults(options, { over: this._onHoverEnter, out: this._onHoverExit });
            }
            this.$el.droppable(options);
            return this;
        },

        _onDoubleClick: function(e) {
            this.trigger('doubleClick:' + this._type, { viewContext: this, event: e });
        },

        _onDrop: function(e, ui) {
            this.trigger('drop:' + this._type, { viewContext: this, event: e, ui: ui });
        },

        //: TODO optimize this class in the future by having a settings has to turn these events
        //: on and off. onhover events are a good example why we would want this as it is slightly expensive
        //: on every hover triggering an event.
        _onHoverEnter: function(e, ui) {
            this.trigger('hoverEnter:' + this._type, { viewContext: this, event: e, ui: ui });
        },

        _onHoverExit: function(e, ui) {
            this.trigger('hoverExit:' + this._type, { viewContext: this, event: e, ui: ui });
        },

        _onMouseDown: function(e) {
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: Doing an event.stopPropagation() onmousedown causes $.selectable or other evenHandlers
            //: behavior to not trigger. We make sure that the current event.target dom `is` this view.$el
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: 1 is a mouse left click event.
            var $target = $(e.target);
            if (e.which == 1 && $target.closest(this.tagName).is(this.$el)) {
                this.trigger('leftClick:' + this._type, { viewContext: this, event: e });
            //: 3 is a mouse right click event
            } else if (e.which == 3 && $target.closest(this.tagName).is(this.$el)) {
                this.trigger('rightClick:' + this._type, { viewContext: this, event: e });
            //: 2 is a middle click event
            } else if (e.which == 2 && $target.closest(this.tagName).is(this.$el)) {
                this.trigger('middleClick:' + this._type, { viewContext: this, event: e });
            }
        }
    });

    return AbstractComponentView;
});


