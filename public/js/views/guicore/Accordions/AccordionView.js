define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AccordionView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.$componentCollection = this.$el;
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
            this.trigger('destroy:' + this._type);
            this.unbindEventHandlers();
            this.off();
        },

        render: function() {
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:accordion', { viewContext: this, model: model });
        },

        addAll: function() {
            this.model.componentCollection.each(this.addOne);
        }
    });

    return AccordionView;
});
