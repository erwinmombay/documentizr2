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
            this.parentId = options && options.parentId;
            this.label = options && options.label || this.model.get('name');
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
            this.$componentCollection = this.$el.find('.tvc-ul');
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:accordionGroup', { viewContext: this, model: model });
        },

        addAll: function() {
            this.model.componentCollection.each(this.addOne);
        }
    });

    return AccordionGroupView;
});
