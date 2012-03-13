define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');

    var SegmentComponentView = DocCompositeComponentView.extend({
        initialize: function(options) {
            DocCompositeComponentView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            //this._type = 'segment';
        },

        render: function(options) {
            DocCompositeComponentView.prototype.render.call(this);
            return this;
        }
    });

    return SegmentComponentView;
});

