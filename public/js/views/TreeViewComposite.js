define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeViewComposite = Backbone.View.extend({

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            return this;
        }
    });
    return TreeViewComposite;
});

