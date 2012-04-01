define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var FieldView = require('views/guicore/Fields/FieldView');

    var detailFieldTemplate = require('text!templates/Fields/DetailField.html');
    var template = require('text!templates/DetailView.html');

    var componentDetailView = Backbone.View.extend({
        _cachedViews: [],
        _cachedCollection: null,
        _cachedCollectionLength: null,

        initialize: function() {
            _.bindAll(this, 'render', 'destroyOne', 'destroyAll', 'addOne');
            this.template = Handlebars.compile(detailFieldTemplate);
            this.$el.append(Handlebars.compile(template));
            this.$fieldset = this.$el.find('fieldset');
        },

        //: TODO this should be redone and re optimized for finer grained updates
        render: function(spec) {
            if (spec && spec.collectionContext) {
                if ((this._cachedCollection !== spec.collectionContext) || 
                    (this._cachedCollection === spec.collectionContext &&
                     this._cachedCollectionLength !== spec.collectionContext.length)) {
                        this.destroyAll();
                        this._cachedCollection = spec.collectionContext;
                        this._cachedCollectionLength = this._cachedCollection.length;
                        _.each(this._cachedCollection.models, this.addOne);
                }
            } else if (this._cachedCollection) {
                this.destroyAll();
                this._cachedCollectionLength = this._cachedCollection.length;
                _.each(this._cachedCollection.models, this.addOne);
            }
            return this;
        },

        destroyOne: function(view) {
            //: before destroying an element, save its data
            if (view.model.schema.nodeType === 'e') {
                view.model.set('data', view.$el.find('.data-repr').val());
            }
            view.destroy();
        },

        destroyAll: function() {
            _.each(this._cachedViews, this.destroyOne);
            //: empty the cached view array
            this._cachedViews.length = 0;
        },

        addOne: function(model) {
            var field;
            field = new FieldView({ model: model });
            this._cachedViews.push(field);
            this.$fieldset.append(field.render().$el);
        }
    });

    return new componentDetailView({ el: $('#detail-panel') });
});
