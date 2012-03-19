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

        fetch: function(options) {
            var newOptions = {
                url: this.url,
                success: _.bind(function(data, status, xhr) {
                    _.each(data, function(value) {
                        var model = new this.model({
                            name: options.context.rootName,
                            fullName: options.context.rootFullName,
                            schema: value,
                            componentCollection: new ComponentCollection()
                        });
                        this.add(model, { silent: true });
                    }, this);
                    if (options) {
                        if (options.success) {
                            options.success();
                        }
                    }
                }, this),
                error: _.bind(function(xhr, status, errObj) {
                    alert('An error has occured fetching the document. Please refresh this page or check your internet connection.');
                }, this)
            };
            $.ajax(newOptions);
        }
    });
    return TreeViewCollection;
});
