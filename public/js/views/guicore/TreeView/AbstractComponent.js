/**
 * views/TreeView/guicore/AbstractComponent.js
 * ~~~~~~~~~~~~~~~~~~~
 * AbstractComponent
 *
 * @author erwin.mombay
 */

define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
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
    var AbstractComponent = Backbone.View.extend({
        tagName: 'li',

        className: 'tvc',

        events: {
            'dblclick': 'onDoubleClick',
            'mousedown': 'onMouseDown'
        },

        initialize: function() {
            _.bindAll(this, 'onDoubleClick', 'onDrop', 'onHoverEnter', 'onHoverExit', 'onMouseDown',
                /*'droppable', 'sortable', 'selectable',*/ '_getType');
            this.observer = { trigger: function() { /** no op **/ } };
            //: _type is used for namspacing the trigger events. ex. `doubleClick:composite`
            this._type = 'component';
            this._getType();
        },

        _getType: function() {
            //: when called this should rebind the private _type property for classes inheriting from
            //: AbstractComponent. we use the _type to namespace the trigger event,
            //: so that for example Composite's doubleClick event is `doubleClick:composite`
            //: while Leaf's doubleClick event is `doubleClick:leaf`.
            //: If the inheriting class does not implement a _type it will fallback to `event:component`.
            this._type = this._type;
        },

        onDoubleClick: function(e) {
            console.log('double click');
            this.observer.trigger('doubleClick:' + this._type, { context: this, event: e });
        },

        onDrop: function(e, ui) {
            this.observer.trigger('drop:' + this._type, { context: this, event: e, ui: ui });
        },

        onHoverEnter: function(e, ui) {
            this.observer.trigger('hoverEnter:' + this._type, { context: this, event: e, ui: ui });
        },

        onHoverExit: function(e, ui) {
            this.observer.trigger('hoverExit:' + this._type, { context: this, event: e, ui: ui });
        },

        onMouseDown: function(e) {
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: Doing an event.stopPropagation() onmousedown causes $.selectable
            //: behavior to not trigger. Because of this our onmousedown sentinels are a little ugly
            //: and complicated. We make sure that the current event.target dom `is` this view.$el
            //: or tvc-container(by doing $target.parent().is(this.$el)) 
            //: or one of the dom elements under tvc-container(by doing $target.parent().parent().is(this.$el)).
            //: WARNING: if ever the standard composite and leaf html templates are changed, this
            //: sentinel/conditional might need to be updated to get desired leftclick event.
            //:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //: 1 is a mouse left click event.
            var $target = $(e.target);
            if (e.which == 1 && ($target.is(this.$el) || $target.parent().is(this.$el) ||
                $target.parent().parent().is(this.$el))) {
                    this.observer.trigger('leftClick:' + this._type, { context: this, event: e });
            //: 3 is a mouse right click event
            } else if (e.which == 3 && ($target.is(this.$el) || $target.parent().is(this.$el) ||
                       $target.parent().parent().is(this.$el))) {
                           this.observer.trigger('rightClick:' + this._type, { context: this, event: e });
            //: 2 is a middle click event
            } else if (e.which == 2 && ($target.is(this.$el) || $target.parent().is(this.$el) ||
                       $target.parent().parent().is(this.$el))) {
                           this.observer.trigger('middleClick:' + this._type, { context: this, event: e });
            }
        }

        //droppable: function(spec) {
            //this.$el.droppable({
                //drop: view.onDrop,
                //greedy: true,
                //accept: '.tvc',
                //tolerance: 'pointer',
                //over: this.onHoverEnter,
                //out: this.onHoverExit
            //});
            //return this;
        //},

        //sortable: function(spec) {
            //this.$el.sortable({
                //helper: 'clone',
                //handle: '.handle',
                //placeholder: 'ui-state-highlight'
            //});
            //return this;
        //},

        //selectable: function(spec) {
            //this.$el.selectable();
        //}
    });

    return AbstractComponent;
});


