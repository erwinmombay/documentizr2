define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/items',

        deepQueryById: function(id) { },

        deepQueryByCid: function(cid) {
            this.each(function(value, key) {
                if (value.cid === cid) {
                    return value;
                }
                if (value.componentCollection) {
                    value.componentCollection.deepQueryByCid(id);
                }
            }, this);
        }
    });
    return ComponentCollection;
});
