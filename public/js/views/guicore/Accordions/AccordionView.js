define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AccordionView = Backbone.View.extend({
        events: {
            'click .accordion-group': 'groupClicked'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll', 'destroy', 'groupClicked');
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
        },

        groupClicked: function(e) {
            var targetId, $target, $elem, href;
            e.preventDefault();
            $target = $(e.target);
            if ($target.attr('data-parent') === ('#' + this.$el.attr('id'))) {
                targetId = (href = $target.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') ;
                alert(targetId);
                $target = this.$el.find(targetId);
                _.each(this.$componentCollection.find('.accordion-body'), function(elem) {
                    $elem = $(elem);
                    if ($target.is($elem) && $target.is('.collapse')) {
                        $elem.removeClass('collapse').addClass('in');
                    } else {
                        $elem.removeClass('in').addClass('collapse');
                    }
                }, this);
            }
        }
    });

    return AccordionView;
});
