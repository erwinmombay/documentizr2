define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var SegmentModel = require('models/SegmentModel');

    var SegmentsCollection = Backbone.Collection.extend({
        model: SegmentModel,
        url: '/items',

        deepQueryById: function(id) { },

        deepQueryByCid: function(cid) {
            this.each(function(value, key) {
                if (value.cid === cid) {
                    return value;
                }
                if (value.segments) {
                    value.segments.deepQueryByCid(id);
                }
            }, this);
        }
    });
    return SegmentsCollection;
});
