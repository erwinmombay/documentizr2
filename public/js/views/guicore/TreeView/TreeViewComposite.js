define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/guicore/TreeView/AbstractTreeViewComponent');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');

    var TreeViewComposite = AbstractTreeViewComponent.extend({
        events: {
            'click': 'onClick',
            'dblclick': 'onDblClick'
        },

        template: [
            '<div class="tvc-container">',
            '<span class="tvc-minus handle"></span>',
            '<span class="tvc-label"></span>',
            '<img class="tvc-img" src="" />',
            '</div>',
            '<ul class="tvc-ul">',
            '</ul>'
        ].join(''),

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll', 'onDrop',
                      'onClick', 'onDblClick', 'ulFoldToggle');
            this.segments = options.segments || new SegmentsCollection(); 
            this.segments.bind('add', this.addOne); 
            $(this.el).attr('id', this.model.cid);
        },

        render: function() {
            $(this.el).append(this.template);
            $(this.el).find('.tvc-label').text('composite ' + this.model.cid);
            this.$segments = $(this.el).children('.tvc-ul');
            this.$tvcPlusMinus = $(this.el).find('.tvc-minus');
            return this;
        },

        onClick: function(e) {
            e.stopPropagation();
            $(this.el).children('div').addClass('tvc-selected');
            if ($(e.target).is(this.$tvcPlusMinus)) {
                this.ulFoldToggle();
            }
        },

        onDblClick: function(e) {
            e.stopPropagation();
            //console.log('========');
            //console.log(e.target);
            //console.log(e.currentTarget);
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
            e.stopPropagation();
            //: this condition makes sure that when the sortable
            //: inside this current object fires an onDrop event
            //: we dont keep on creating a new segment model
            //console.log('=====');
            //console.log(e.isPropagationStopped());
            //console.log(e.target);
            //console.log(e.currentTarget);
            if ($(e.target).find(ui.helper).length) {
                return;
            }
            var model = new SegmentModel();
            model.segments = new SegmentsCollection();
            this.segments.add(model);
        },

        addOne: function(model) {
            var view = null;
            if (model.segments) {
                view = new TreeViewComposite({ model: model });
                $(view.el).droppable({ drop: view.onDrop, greedy: true });
                $(view.render().$segments)
                    .sortable({
                        helper: 'clone', placeholder: 'ui-state-highlight',
                        handle: '.handle'
                    });
            } else {
                view = new TreeViewLeaf({ model: model });
                view.render();
            }
            this.$segments.append(view.el);
        },

        addAll: function () {
            this.segments.each(this.addOne);
        }
    });
    return TreeViewComposite;
});
