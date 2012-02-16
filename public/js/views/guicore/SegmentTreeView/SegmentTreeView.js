define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var SegmentTreeViewComposite = require('views/guicore/SegmentTreeView/SegmentTreeViewComposite');
    var SegmentTreeViewLeaf = require('views/guicore/SegmentTreeView/SegmentTreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var SegmentTreeView = TreeView.extend({
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
                view = new SegmentTreeViewComposite({ model: model });
                view.$el.droppable({ drop: view.onDrop });
                view.render().$segments
                    .sortable({
                        helper: 'clone',
                        handle: '.handle',
                        placeholder: 'ui-state-highlight'
                    })
                    //: sure distance > 0 so that we click events are still triggered
                    .selectable({ distance: 20 });
            } else {
                view = new SegmentTreeViewLeaf({ model: model });
                view.render();
            }
            this.$ul.append(view.el);
        },

        addAll: function () {
            this.segments.each(this.addOne);
        }
    });
    return SegmentTreeView;
});
