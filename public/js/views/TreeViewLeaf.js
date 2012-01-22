define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeViewLeaf = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            return this;
        }
    });
    return TreeViewLeaf;
});

