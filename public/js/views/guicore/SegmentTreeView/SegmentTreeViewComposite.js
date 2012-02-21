define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var SegmentsCollection = require('collections/SegmentsCollection');

    var SegmentTreeViewComposite = TreeViewComposite.extend({
        events: {
            'dblclick': 'onDoubleClick',
            'mousedown': 'onMouseDown'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOneView', 'addAllViews' , 'onDrop', 'onMouseDown',
                'onDoubleClick', 'foldToggle', 'onHoverEnter', 'onHoverExit');
            this.collection = options.collection || new SegmentsCollection();
            this.$collection = null;
            this.subscriber = options.subscriber || { trigger: function() { /** no op **/ } };
            this.collection.on('add', this.addOneView);
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.cid }));
            this.$collection = this.$el.children('.tvc-ul');
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
            this.$collection.toggle();
            this.subscriber.trigger('foldToggle:composite', this);
        },

        onDoubleClick: function(e) {
           this.subscriber.trigger('doubleClick:composite', { context: this, event: e });
        },

        onMouseDown: function(e) {
            //: 1 is a mouse left click event
            if (e.which == 1) {
                //: doing an event.stopPropagation on lefclick mousedown causes $.selectable
                //: behavior to not trigger. take this into account if you want to
                //: stop the event propagation.
                this.subscriber.trigger('leftClick:composite', { context: this, event: e });
            //: 3 is a mouse right click event
            } else if (e.which == 3) {
                this.subscriber.trigger('rightClick:composite', { context: this, event: e });
            } else if (e.which == 2) {
                this.subscriber.trigger('middleClick:composite', { context: this, event: e });
            }
        },

        onDrop: function(e, ui) {
            this.subscriber.trigger('drop:composite', { context: this, event: e, ui: ui });
        },

        onHoverEnter: function(e, ui) {
            this.subscriber.trigger('hoverEnter:composite', { context: this, event: e, ui: ui });
        },

        onHoverExit: function(e, ui) {
            this.subscriber.trigger('hoverExit:composite', { context: this, event: e, ui: ui });
        },

        addOneView: function(model) {
            this.subscriber.trigger('addOneView:composite', { context: this, model: model });
        },

        addAllViews: function() {
            this.collection.each(this.addOneView);
            this.subscriber.trigger('addAllViews:composite', this);
            return this;
        }
    });
    return SegmentTreeViewComposite;
});
