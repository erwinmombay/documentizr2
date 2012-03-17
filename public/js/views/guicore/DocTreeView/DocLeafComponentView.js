define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');

    var DocLeafComponentView = LeafComponentView.extend({
        initialize: function(options) {
            LeafComponentView.prototype.initialize.call(this, options);
            this.schema = options.schema || {};
        }
    });

    return DocLeafComponentView;
});

