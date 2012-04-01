define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var elementTemplate = require('text!templates/Element.html');

    var componentEditorView = Backbone.View.extend({
        events: {
            'click #save': 'saveInput'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'clear', 'saveInput');
            this._cachedModel = null;
            this._cachedSpec = null;
            this.template = Handlebars.compile(elementTemplate); 
        },

        render: function(spec) {
            this.$el.empty();
            this._cachedSpec = spec;
            this._cachedModel = spec.viewContext.model;
            this.$el.append(this.template({
                label: this._cachedModel.get('name'),
                name: this._cachedModel.get('name'),
                value: this._cachedModel.get('data')
            }));
            return this;
        },

        clear: function() {
            this.$el.empty();
            this._cachedSpec = null;
            this._cachedModel = null;
            return this;
        },

        saveInput: function() {
            if (this._cachedModel) {
                this._cachedModel.set('data', this.$el.find('input#element').val());
            }
        }
    });

    return new componentEditorView({ el: $('#editor-panel') });
});
