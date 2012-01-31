define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var EDITreeView = TreeView.extend({
        tagName: 'div',

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.segments = this.collection = options.collection || new SegmentsCollection();
            this.segments.bind('add', this.addOne); 
            this.$ul = $('<ul/>', { 'class': 'tvc' });
        },

        render: function() {
            $(this.el).empty();
            $(this.el).append(this.$ul);
            this.addAll();
            return this;
        },

        addOne: function(model) {
            var view = null;
            if (model.segments) {
                view = new TreeViewComposite({ model: model });
                view.$el.droppable({ drop: view.onDrop });
                view.render().$segments.sortable({ handle: '.handle' });
            } else {
                view = new TreeViewLeaf({ model: model });
                view.render();
            }
            this.$ul.append(view.el);
        },

        addAll: function () {
            this.segments.each(this.addOne);
        }
    });
    return EDITreeView;
});
