define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var SegmentModel = require('models/SegmentModel');

    var SegmentsCollection = Backbone.Collection.extend({
        model: SegmentModel,
        url: '/items'
    });
    return SegmentsCollection;
});
