define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var accordionGroupTemplate = require('text!templates/Accordions/AccordionGroup.html');

    var AccordionGroupView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll', 'bindEventHandlers', 'unbindEventHandlers');
            this.template = options && options.template || accordionGroupTemplate;
            this.template = Handlebars.compile(this.template);
            this.parentId = options && options.parentId || null;
            this.label = options && options.label || this.model.get('name');
            this.$componentCollection = null;
            this.bindEventHandlers();
        },

        bindEventHandlers: function() {
            this.model.componentCollection.on('add', this.addOne, this);
        },

        unbindEventHandlers: function() {
            this.model.componentCollection.off('add', this.addOne, this);
        },

        destroy: function() {
            this.remove();
            this.unbindEventHandlers();
            this.off();
        },

        render: function() {
            this.$el.append(this.template({ parentId: this.parentId, id: this.label, label: this.label  }));
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:accordionGroup', { viewContext: this, model: model });
        },

        addAll: function() {
            this.model.componentCollection.each(this.addOne);
        }

        //_onMouseDown: function(e) {
            ////:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ////: Doing an event.stopPropagation() onmousedown causes $.selectable or other evenHandlers
            ////: behavior to not trigger. We make sure that the current event.target dom `is` this view.$el
            ////:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ////: 1 is a mouse left click event.
            //var $target = $(e.target);
            //if (e.which == 1 && $target.closest(this.tagName).is(this.$el)) {
                //this.trigger('leftClick:' + this._type, { viewContext: this, event: e });
            ////: 3 is a mouse right click event
            //} else if (e.which == 3 && $target.closest(this.tagName).is(this.$el)) {
                //this.trigger('rightClick:' + this._type, { viewContext: this, event: e });
            ////: 2 is a middle click event
            //} else if (e.which == 2 && $target.closest(this.tagName).is(this.$el)) {
                //this.trigger('middleClick:' + this._type, { viewContext: this, event: e });
            //}
        //}
    });

    return AccordionGroupView;
});
