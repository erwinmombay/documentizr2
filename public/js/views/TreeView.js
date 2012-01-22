define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeView = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'render', 'add', 'addAll');
        },

        render: function() {
            return this;
        },

        add: function (model) {
        },

        addAll: function () {
            this.collection.each(this.add);
        }
    });
    return TreeView;
});
