define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');

    var SegmentTreeViewComposite = TreeViewComposite.extend({
        events: {
            'click': 'onClick',
            'dblclick': 'onDblClick'
        },

        initialize: function(options) {
            _.bindAll(this, 'addOne', 'onDrop', 'onClick', 'onDblClick', 'ulFoldToggle');
            this.segments = options.segments || new SegmentsCollection(); 
            this.segments.on('add', this.addOne); 
            this.$el.attr('id', this.model.cid);
        },

        onClick: function(e) {
            e.stopPropagation();
            console.log('click ' + this.model.cid);
            this.$el.children('div').addClass('tvc-selected');
            if ($(e.target).is(this.$tvcPlusMinus)) {
                this.ulFoldToggle();
            }
        },

        onDblClick: function(e) {
            e.stopPropagation();
            console.log('dblclick ' + this.model.cid);
            if ($(e.target).parent() === ($(e.currentTarget).children('.tvc-container')) ||
                $(e.target) === ($(e.currentTarget).children('.tvc-container'))) {
                    this.ulFoldToggle();
            }
        },

        ulFoldToggle: function() {
            var that = this;
            this.$tvcPlusMinus.toggleClass(function() {
                return that.$tvcPlusMinus.is('.tvc-minus') ?
                    'tvc-plus' : 'tvc-minus';
            });
            this.$segments.toggle();
        },

        onDrop: function(e, ui) {
            var i;
            e.stopPropagation();
            //: this condition makes sure that when the sortable
            //: inside this current object fires an onDrop event
            //: we dont keep on creating a new segment model
            if ($(e.target).find(ui.helper).length) {
                return;
            }
            //: create the number of helpers dropped
            for (i = 0; i < ui.helper.length; i++) {
                var model = new SegmentModel();
                model.source = this.source || null;
                model.segments = new SegmentsCollection();
                this.segments.add(model);
            }
        },

        addOne: function(model) {
            var view = null;
            if (model.segments) {
                view = new SegmentTreeViewComposite({ model: model });
                view.$el.droppable({ drop: view.onDrop, greedy: true });
                view.render().$segments
                    .sortable({
                        helper: 'clone',
                        placeholder: 'ui-state-highlight',
                        handle: '.handle'
                    })
                    .selectable();
            } else {
                view = new SegmentTreeViewLeaf({ model: model });
                view.render();
            }
            this.$segments.append(view.el);
        }
    });
    return SegmentTreeViewComposite;
});
