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
            this.mediator = options.mediator || { trigger: function() { /** no op **/ } };
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
                view = new SegmentTreeViewComposite({ model: model, mediator: this.mediator });
                view.$el.droppable({
                    drop: view.onDrop,
                    greedy: true,
                    accept: '.tvc',
                    tolerance: 'pointer',
                    over: view.onHoverEnter,
                    out: view.onHoverExit
                });
                view.render().$segments
                    .sortable({
                        helper: 'clone',
                        handle: '.handle',
                        placeholder: 'ui-state-highlight'
                    }) 
                    //: make sure distance > 0 so that click events are still triggered
                    .selectable({ distance: 1 });
            } else {
                view = new SegmentTreeViewLeaf({ model: model, mediator: this.mediator });
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
