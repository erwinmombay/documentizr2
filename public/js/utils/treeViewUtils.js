define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var treeViewUtils = {};

    treeViewUtils.walkTreeViewModels = function(model) {
        if (model && model.componentCollection && model.schema) {
            _.each(model.schema.collection, function(value) {
                if (_.include(['Table_1', 'Table_2', 'Table_3'], value.name) ||
                    _.include(['M', 'M/Z'], value.req)) {
                    var schema = model.schema.collection[value.fullName];
                    var newModel = new ComponentModel({
                        name: schema.name,
                        fullName: schema.fullName,
                        schema: schema || null,
                        componentCollection: schema && schema.collection &&
                                             new ComponentCollection() || null
                    });
                    model.componentCollection.add(newModel);
                    treeViewUtils.walkTreeViewModels(newModel);
                }
            }, this);
        }
    };

    return treeViewUtils;
});
