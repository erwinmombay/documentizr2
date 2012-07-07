/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/component',

        initialize: function(models, options) {
        }
    });

    return ComponentCollection;
});
