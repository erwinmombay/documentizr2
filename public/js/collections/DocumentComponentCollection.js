define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var DocumentComponentModel = require('models/DocumentComponentModel');

    var DocumentComponentCollection = Backbone.Collection.extend({
        model: DocumentComponentModel,
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
    return DocumentComponentCollection;
});
