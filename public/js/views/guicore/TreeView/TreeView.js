define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'add', 'addAll');
            this.collection.on('add', this.addOne);
        },

        render: function() {
            return this;
        },

        addOne: function (model) {
            var view = Backbone.View();
            view.render();
            this.$el.append(view.el);
        },

        addAll: function () {
            this.collection.each(this.add);
        }
    });
    return TreeView;
});
