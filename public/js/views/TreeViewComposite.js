define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/AbstractTreeViewComponent');
    var TreeViewLeaf = require('views/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');

    var TreeViewComposite = AbstractTreeViewComponent.extend({
        tagName: 'li',

        events: {
            'click': 'onClick',
            'dblclick .tvc-container': 'onDblClick'
        },

        template: [
            '<div class="tvc-container">',
            '<span class="tvc-label">',
            '</span>',
            '</div>',
            '<ul class="tvc-nodes">',
            '</ul>'
        ].join(''),

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll', 'onDrop', 'onClick', 'onDblClick');
            this.segments = options.segments || new SegmentsCollection(); 
            this.segments.bind('add', this.addOne); 
            $(this.el).attr('id', this.model.cid);
        },

        render: function() {
            $(this.el).append(this.template);
            $(this.el).find('.tvc-label').text(this.model.cid);
            this.$segments = $(this.el).children('.tvc-nodes');
            return this;
        },

        onClick: function(e) {
            e.stopPropagation();
            $(this.el).children('div').addClass('tv-selected');
        },

        onDblClick: function(e) {
            e.stopPropagation();
            console.log('triggered');
            this.$segments.toggle();
        },

        onDrop: function(events, ui) {
            var model = new SegmentModel();
            this.segments.add(model);
        },

        addOne: function(model) {
            var view = null;
            if (model.segments) {
                view = new TreeViewComposite({ model: model });
                $(view.el).droppable({ drop: view.onDrop });
            } else {
                view = new TreeViewLeaf({ model: model });
            }
            view.render();
            this.$segments.append(view.el);
        },

        addAll: function () {
            this.segments.each(this.addOne);
        }
    });
    return TreeViewComposite;
});

