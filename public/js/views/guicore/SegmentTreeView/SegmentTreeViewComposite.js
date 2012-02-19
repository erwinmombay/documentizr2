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
            'dblclick': 'onDoubleClick',
            'mousedown': 'onMouseDown'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'onDrop', 'onMouseDown',
                      'onDblClick', 'foldToggle', 'onHoverEnter', 'onHoverExit');
            this.segments = options.segments || new SegmentsCollection();
            this.mediator = options.mediator || { trigger: function() { /** no op **/ } };
            this.segments.on('add', this.addOne); 
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.cid }));
            this.$segments = this.$el.children('.tvc-ul');
            this.$tvcPlusMinus = this.$('.tvc-minus');
            this.addAll();
            return this;
        },

        foldToggle: function() {
            var that = this;
            this.$tvcPlusMinus.toggleClass(function() {
                return that.$tvcPlusMinus.is('.tvc-minus') ?
                    'tvc-plus' : 'tvc-minus';
            });
            this.$segments.toggle();
        },

        onDoubleClick: function(e) {
           this.mediator.trigger('doubleClick:composite', { context: this, event: e }); 
        },

        onMouseDown: function(e) {
            //: 1 is left click
            if (e.which == 1) {
                //: doing an event.stopPropagation on lefclick mousedown causes $.selectable 
                //: behavior to not trigger. take this into account if you want to
                //: stop the event propagation.
                this.mediator.trigger('leftClick:composite', { context: this, event: e });
            //: 3 is right click
            } else if (e.which == 3) {
                this.mediator.trigger('rightClick:composite', { context: this, event: e });
            }
        },

        onDrop: function(e, ui) {
            this.mediator.trigger('drop:composite', { context: this, event: e, ui: ui });
        },

        onHoverEnter: function(e, ui) {
            this.mediator.trigger('hoverEnter:composite', { context: this, event: e, ui: ui });
        },

        onHoverExit: function(e, ui) {
            this.mediator.trigger('hoverExit:composite', { context: this, event: e, ui: ui });
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
            console.log(view);
            this.$segments.append(view.el);
        },
        
        addAll: function() {
            this.segments.each(this.addOne);
            return this;
        }
    });
    return SegmentTreeViewComposite;
});
