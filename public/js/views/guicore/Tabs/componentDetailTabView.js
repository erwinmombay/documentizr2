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
            _.bindAll(this, 'render', 'clear');
            this.template = Handlebars.compile(detailFieldTemplate);
            this.$el.attr('id', this.id);
            this.$fields = this.$el.find('.span8');
        },

        //: TODO this should be redone and re optimized for finer grained updates
        //: rerending the whole fieldset is very expensive on auto update
        render: function(spec) {
            var field;
            if (this._cachedCollection !== spec.viewContext.model.collection) {
                _.each(this._cachedViews, function(view) { view.destroy(); });
                //: empty the cached view array
                this._cachedViews.length = 0;
                this._cachedCollection = spec.viewContext.model.collection;
                _.each(this._cachedCollection.models, function(model) {
                    field = new FieldView({ model: model });
                    this._cachedViews.push(field);
                    this.$fields.append(field.render().$el);
                }, this);
            }
            return this;
        },

        clear: function() {
            this.$fields.empty();
            return this;
        }
    });

    return new componentDetailTabView();
});
