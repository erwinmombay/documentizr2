define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var componentDetailView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this._cachedCollection = null;
        },

        render: function(spec) {
            this.$el.empty();
            this._cachedCollection = spec.viewContext.model.collection;
            var $ul = $('<ul/>');
            _.each(this._cachedCollection.models, function(model) {
                var $li = $('<li/>').append(JSON.stringify(model));
                $ul.append($li);
            }, this);
            this.$el.append($ul);
            return this;
        }
    });

    return new componentDetailView({ el: $('#detail-view') });
});
