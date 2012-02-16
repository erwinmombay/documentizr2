define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var mediator = require('views/mediator');
    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');

    var SegmentTreeViewComposite = TreeViewComposite.extend({
        events: {
            'dblclick': 'onDblClick',
            'mousedown': 'onMouseDown'
        },
        
        initialize: function(options) {
            _.bindAll(this, 'addOne', 'onDrop', 'onMouseDown', 'onDblClick', 'ulFoldToggle');
            this.segments = options.segments || new SegmentsCollection(); 
            this.segments.on('add', this.addOne); 
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        ulFoldToggle: function() {
            var that = this;
            this.$tvcPlusMinus.toggleClass(function() {
                return that.$tvcPlusMinus.is('.tvc-minus') ?
                    'tvc-plus' : 'tvc-minus';
            });
            this.$segments.toggle();
        },

        onDblClick: function(e) {
            e.stopPropagation();
            console.log('dblclick ' + this.model.cid);
            if ($(e.target).parent() === ($(e.currentTarget).children('.tvc-container')) ||
                $(e.target) === ($(e.currentTarget).children('.tvc-container'))) {
                    this.ulFoldToggle();
            }
        },

        onMouseDown: function(e) {
            //: 1 is left click
            if (e.which == 1) {
                console.log(e.which);
                console.log('clicked composite ' + this.model.cid);
                e.stopPropagation();
                this.$el.children('div').addClass('tvc-selected');
                if ($(e.target).is(this.$tvcPlusMinus)) {
                    this.ulFoldToggle();
                }
            //: 3 is right click
            } else if (e.which == 3) {
                mediator.trigger('rightClick', this);
            }
        },

        onDrop: function(e, ui) {
            e.stopPropagation();
            mediator.trigger('drop:composite', { context: this, event: e, ui: ui });

        },
        
        addOne: function(model) {
            var view = null;
            if (model.segments) {
                console.log('adding segment');
                view = new SegmentTreeViewComposite({ model: model });
                view.$el.droppable({ drop: view.onDrop, greedy: true });
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
            console.log(view.events);
            this.$segments.append(view.el);
        }
    });
    return SegmentTreeViewComposite;
});
