define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/EDITreeView');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var EDITreeView = TreeView.extend({

        initialize: function(options) {
            _.bindAll(this, 'render', 'add', 'addAll');
            this.segments = this.collection = options.collection || new SegmentsCollection(); 
        },

        render: function() {
            return this;
        },

        add: function(model) {
            var view = null;
            new TreeViewComponent();
            if (model.blueprint.segments) {
                view = TreeViewComponent.getInstance('composite', model);
            } else {
                view = TreeViewComponent.getInstance('leaf', model);
            }
        },

        addAll: function () {
            this.collection.each(this.add);
        }
    });
    return TreeView;
});
