define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');

    var TreeViewCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/document',

        initialize: function(models, options) {
        }
    });
    return TreeViewCollection;
});
