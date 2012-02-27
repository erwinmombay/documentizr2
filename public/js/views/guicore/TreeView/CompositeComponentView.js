define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
    var ComponentCollection = require('collections/ComponentCollection');
    var CompositeTemplate = require('text!templates/TreeView/CompositeTemplate.html');

    var CompositeComponentView = AbstractComponentView.extend({
        template: CompositeTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponentView to
            //: `this` CompositeComponent instance.
            AbstractComponentView.prototype.initialize.call(this);
            _.bindAll(this, 'render', 'addOneView', 'addAllViews', 'foldToggle');
            this._type = 'composite';
            this.model.componentCollection = options.collection || new ComponentCollection();
            this.model.componentCollection.on('add', this.addOneView);
            //: models have componentCollection while views have
            //: $componentCollection which are the nested views which
            //: we attach this current view
            this.$componentCollection = null;
            this.observer = options.observer;
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
            this.contextMenu = options.contextMenu;
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

        addOneView: function(model) {
            this.observer.trigger('addOneView:composite', { viewContext: this, model: model });
        },

        addAllViews: function() {
            this.model.componentCollection.each(this.addOneView);
            this.observer.trigger('addAllViews:composite', this);
            return this;
        }

        //droppable: function(spec) {
            //this.$el.droppable({
                //drop: view.onDrop,
                //greedy: true,
                //accept: '.tvc',
                //tolerance: 'pointer',
                //over: this.onHoverEnter,
                //out: this.onHoverExit
            //});
            //return this;
        //},

        //sortable: function(spec) {
            //this.$el.sortable({
                //helper: 'clone',
                //handle: '.handle',
                //placeholder: 'ui-state-highlight'
            //});
            //return this;
        //},

        //selectable: function(spec) {
            //this.$el.selectable();
        //}
    });

    return CompositeComponentView;
});
