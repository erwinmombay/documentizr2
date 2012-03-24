define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');

    var DocLeafComponentView = LeafComponentView.extend({
        initialize: function(options) {
            LeafComponentView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.schema = options.schema || {};
        },

        render: function() {
            LeafComponentView.prototype.render.call(this);
            console.log(this.model);
            if (_.include(['M', 'M/Z'], this.model.schema.req)) {
                this.$el.find('.tvc-label').css({ 'color': 'red' });
            }
            return this;
        }
    });

    return DocLeafComponentView;
});

