define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponent = require('views/guicore/TreeView/AbstractComponent');
    var DocumentComponentCollection = require('collections/DocumentComponentCollection');
    var compositeTemplate = require('text!templates/TreeView/compositeTemplate.html');

    var CompositeComponent = AbstractComponent.extend({
        template: compositeTemplate,

        events: {
            'dblclick': 'onDoubleClick',
            'mousedown': 'onMouseDown'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOneView', 'addAllViews' , 'onDrop', 'onMouseDown',
                'onDoubleClick', 'foldToggle', 'onHoverEnter', 'onHoverExit');
            this.componentCollection = options.collection || new DocumentComponentCollection();
            this.componentCollection.on('add', this.addOneView);
            this.$componentCollection = null;
            this.observer = options.observer || { trigger: function() { /** no op **/ } };
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.cid }));
            this.$componentCollection = this.$el.children('.tvc-ul');
            this.$tvcPlusMinus = this.$('.tvc-minus');
            this.addAllViews();
            return this;
        },

        foldToggle: function() {
            var that = this;
            this.$tvcPlusMinus.toggleClass(function() {
                return that.$tvcPlusMinus.is('.tvc-minus') ?
                    'tvc-plus' : 'tvc-minus';
            });
            this.$componentCollection.toggle();
            this.observer.trigger('foldToggle:composite', this);
        },

        onDoubleClick: function(e) {
           this.observer.trigger('doubleClick:composite', { context: this, event: e });
        },

        onMouseDown: function(e) {
            //: 1 is a mouse left click event
            if (e.which == 1) {
                //: doing an event.stopPropagation on lefclick mousedown causes $.selectable
                //: behavior to not trigger. take this into account if you want to
                //: stop the event propagation.
                this.observer.trigger('leftClick:composite', { context: this, event: e });
            //: 3 is a mouse right click event
            } else if (e.which == 3) {
                this.observer.trigger('rightClick:composite', { context: this, event: e });
            } else if (e.which == 2) {
                this.observer.trigger('middleClick:composite', { context: this, event: e });
            }
        },

        onDrop: function(e, ui) {
            this.observer.trigger('drop:composite', { context: this, event: e, ui: ui });
        },

        onHoverEnter: function(e, ui) {
            this.observer.trigger('hoverEnter:composite', { context: this, event: e, ui: ui });
        },

        onHoverExit: function(e, ui) {
            this.observer.trigger('hoverExit:composite', { context: this, event: e, ui: ui });
        },

        addOneView: function(model) {
            this.observer.trigger('addOneView:composite', { context: this, model: model });
        },

        addAllViews: function() {
            this.componentCollection.each(this.addOneView);
            this.observer.trigger('addAllViews:composite', this);
            return this;
        }
    });

    return CompositeComponent;
});
