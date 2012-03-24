define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var componentValidationTabView = Backbone.View.extend({
        id: 'validation-pane',
        className: 'tab-pane',
        name: 'validation',

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            this.$el.empty();
            return this;
        }
    });

    return new componentValidationTabView(); 
});
