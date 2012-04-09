define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/component',

        initialize: function(models, options) {
        }
    });

    return ComponentCollection;
});
