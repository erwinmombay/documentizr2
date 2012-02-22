define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponent = require('views/guicore/TreeView/AbstractComponent');
    var ComponentCollection = require('collections/ComponentCollection');
    var compositeTemplate = require('text!templates/TreeView/CompositeTemplate.html');

    var CompositeComponent = AbstractComponent.extend({
        template: compositeTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponent to
            //: `this` CompositeComponent instance.
            AbstractComponent.prototype.initialize.call(this);
            _.bindAll(this, 'render', 'addOneView', 'addAllViews', 'foldToggle');
            this._type = 'composite';
            this.componentCollection = options.collection || new ComponentCollection();
            this.componentCollection.on('add', this.addOneView);
            this.$componentCollection = null;
            this.observer = options.observer;
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
