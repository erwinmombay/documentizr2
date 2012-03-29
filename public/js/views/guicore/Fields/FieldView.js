define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var detailFieldTemplate = require('text!templates/Fields/DetailField.html');

    var FieldView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'destroy', 'bindEventHandlers', 'unbindEventHandlers', 'reRender');
            this.template = Handlebars.compile(options.template || detailFieldTemplate);
            this.custom = this.model.custom;
            this.bindEventHandlers();
        },

        bindEventHandlers: function() {
            if (this.model.schema.nodeType === 'e') this.model.on('change:data', this.reRender, this);
        },

        unbindEventHandlers: function() {
            this.model.off(null, null, this);
        },

        render: function() {
            this.$el.append(this.template({
                id: 'd' + this.model.cid,
                name: this.model.get('name'),
                fullName: this.model.get('fullName'),
                data: this.model.get('data') || null
            }));
            this.$data = this.$el.find('.data-repr');
            if (this.custom) _.bind(this.custom, this)();
            return this;
        },

        reRender: function() {
            this.$data.empty();
            this.$data.text(this.model.get('data'));
            return this;
        },

        destroy: function() {
            this.remove();
            this.unbindEventHandlers();
            this.off();
        }
    });

    return FieldView;
});
