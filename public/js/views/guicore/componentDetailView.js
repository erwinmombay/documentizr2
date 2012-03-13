define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var componentDetailView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this._cachedSpec = null;
        },

        render: function(spec) {
            this.$el.empty();
            this._cachedSpec = spec;
            var $ul = $('<ul/>');
            if (this._cachedSpec.viewContext.model.get('schema').nodeType === 'element') {
                _.each(this._cachedSpec.viewContext.model.collection.models, function(model) {
                    var $li = $('<li/>').append(JSON.stringify(model.toJSON(), null , 4));
                    $ul.append($li);
                }, this);
            } else {
                _.each(this._cachedSpec.viewContext.model.componentCollection.models, function(value) {
                    var $li = $('<li/>').append(JSON.stringify(value, null, 4));
                    $ul.append($li);
                }, this);
            }
            this.$el.append($ul);
            return this;
        }
    });

    return new componentDetailView({ el: $('#detail-view') });
});
