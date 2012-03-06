define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');

    var DocCompositeComponentView = CompositeComponentView.extend({
        initialize: function(options) {
            CompositeComponentView.prototype.initialize.call(this, options);
            this.schema = options.schema || {};
            this.editor = options.editor;
        }
    });

    return DocCompositeComponentView;
});
