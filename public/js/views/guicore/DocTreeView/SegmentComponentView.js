define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');
    var SegmentTemplate = require('text!templates/TreeView/SegmentTemplate.html');

    var SegmentComponentView = DocLeafComponentView.extend({
        initialize: function(options) {
            DocLeafComponentView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.template = SegmentTemplate;
        },

        render: function() {
            DocLeafComponentView.prototype.render.call(this);
            if (this.model.has('elements')) {
                this.$elements = this.$el.children('.tvc-ul');
                console.log(this.$elements);
                _.each(this.model.get('elements'), function(value, key) {
                    var $element = $('<li/>').append(key + ': ' + value);
                    this.$elements.append($element);
                }, this);
                console.log(this.$elements);
                this.$el.append(this.$elements);
            }
            return this;
        }
    });

    return SegmentComponentView;
});

