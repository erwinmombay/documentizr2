define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var FieldView = require('views/guicore/Fields/FieldView');

    var detailFieldTemplate = require('text!templates/Fields/DetailField.html');
    var componentDetailTabViewTemplate = require('text!templates/Tabs/DetailTab.html');

    var componentDetailTabView = Backbone.View.extend({
        name: 'detail',
        id: 'detail-pane',
        el: componentDetailTabViewTemplate,
        _cachedViews: [],
        _cachedCollection: null,

        initialize: function() {
            _.bindAll(this, 'render', 'clear', 'destroyOneFieldView', 'addOneFieldView');
            this.template = Handlebars.compile(detailFieldTemplate);
            this.$el.attr('id', this.id);
            this.$fields = this.$el.find('.span8');
        },

        //: TODO this should be redone and re optimized for finer grained updates
        render: function(spec) {
            if (this._cachedCollection !== spec.viewContext.model.collection) {
                _.each(this._cachedViews, this.destroyOneFieldView);
                //: empty the cached view array
                this._cachedViews.length = 0;
                this._cachedCollection = spec.viewContext.model.collection;
                _.each(this._cachedCollection.models, this.addOneFieldView);
            }
            return this;
        },

        destroyOneFieldView: function(view) {
            view.destroy();
        },

        addOneFieldView: function(model) {
            var field;
            field = new FieldView({ model: model });
            this._cachedViews.push(field);
            this.$fields.append(field.render().$el);
        },

        clear: function() {
            this.$fields.empty();
            return this;
        }
    });

    return new componentDetailTabView();
});
