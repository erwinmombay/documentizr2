define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var elementTemplate = require('text!templates/Element.html');
    var componentDetailView = require('views/guicore/componentDetailView');

    var componentEditorView = Backbone.View.extend({
        events: {
            'click #save': 'saveInput'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'clear', 'saveInput');
            this._cachedModel = null;
            this._cachedSpec = null;
        },

        render: function(spec) {
            this.$el.empty();
            this._cachedSpec = spec;
            this._cachedModel = spec.viewContext.model;
            var template = Handlebars.compile(elementTemplate);
            this.$el.append(template({
                label: 'name',
                name: this._cachedModel.get('name') ,
                value: this._cachedModel.get('name')
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
            this._cachedModel.set('name', this.$el.find('#element').val());
            componentDetailView.render(this._cachedSpec);
        }
    });

    return new componentEditorView({ el: $('#editor-view') });
});
