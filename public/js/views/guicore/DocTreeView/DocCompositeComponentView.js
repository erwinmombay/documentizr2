define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');

    var DocCompositeComponentView = CompositeComponentView.extend({
        initialize: function(options) {
            CompositeComponentView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.schema = options.schema || {};
        },

        render: function() {
            CompositeComponentView.prototype.render.call(this);
            if (_.include(['M', 'M/Z'], this.model.schema.req) ||
                _.include(['810', 'Table_1', 'Table_2', 'Table_3'], this.model.schema.name)) {
                    this.$el.find('.tvc-label').css({ 'color': 'red' });
            }
            return this;
        }
    });

    return DocCompositeComponentView;
});
