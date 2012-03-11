define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var TreeViewCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/document',

        initialize: function(models, options) {
            _.bindAll(this, 'fetch');
        },

        fetch: function(spec) {
            var newSpec = {
                url: this.url,
                success: _.bind(function(data, status, xhr) {
                    _.each(data, function(value) {
                        var model = new this.model({
                            name: spec.context.rootName,
                            fullName: spec.context.rootFullName,
                            schema: value,
                            componentCollection: new ComponentCollection()
                        });
                        this.add(model, { silent: true });
                    }, this);
                    if (spec && spec.success) {
                        spec.success();    
                    }
                }, this),
                error: _.bind(function(xhr, status, errObj) {
                    alert('an error has occured while requesting document.');
                }, this)
            };
            $.ajax(newSpec);
        }
    });
    return TreeViewCollection;
});
