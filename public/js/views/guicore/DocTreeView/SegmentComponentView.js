define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');

    var SegmentComponentView = DocLeafComponentView.extend({
        initialize: function(options) {
            DocLeafComponentView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
        },

        render: function() {
            if (this.has('elements')) {

            }
        }
    });

    return SegmentComponentView;
});

