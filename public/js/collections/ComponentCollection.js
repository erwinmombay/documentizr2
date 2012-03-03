define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/items',

        initialize: function(models, options) {
            _.bindAll(this, 'reset');
        },

        reset: function(options) {
            Backbone.Collection.prototype.reset.call(this, options);
        }

    });
    return ComponentCollection;
});
