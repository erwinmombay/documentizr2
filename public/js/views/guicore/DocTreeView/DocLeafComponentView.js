/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');
    var docLeafTemplate = require('text!templates/DocTreeView/DocLeafTemplate.html');

    var DocLeafComponentView = LeafComponentView.extend({
        template: docLeafTemplate,

        initialize: function(options) {
            LeafComponentView.prototype.initialize.call(this, options);
            this.schema = options.schema || {};
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({
                label: this.model.get('name'),
                fullName: this.model.schema.fullName
            }));
            if (_.include(['M', 'M/Z'], this.model.schema.req)) {
                this.$el.find('.tvc-label').css({ 'color': 'red' });
            }
            this.trigger('render:' + this._type, this);
            return this;
        }
    });

    return DocLeafComponentView;
});

