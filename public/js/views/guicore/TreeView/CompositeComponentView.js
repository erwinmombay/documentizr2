define(function(require) {
    'use strict';
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
            //: this is like calling super() in javascript
            AbstractComponentView.prototype.initialize.call(this);
            _.bindAll(this, 'render', 'addOne', 'addAll', 'foldToggle', 'selectable', 'sortable');
            this._type = 'composite';
            //: bind the models' componentCollection `add` event to `addOne` 
            //: so that when we add models to the collection
            //: it automatically adds the nested views as well
            this.model.componentCollection.on('add', this.addOne);
            //: models have componentCollection while views have
            //: $componentCollection which are the dom elements we dynamically attach
            this.$componentCollection = null;
            this.observer = options.observer;
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.get('name') }));
            this.$componentCollection = this.$el.children('.tvc-ul');
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
            this.$componentCollection.toggle();
            this.observer.trigger('foldToggle:composite', this);
        },

        addOne: function(model) {
            this.observer.trigger('addOne:composite', { viewContext: this, model: model });
        },

        addAll: function() {
            this.model.componentCollection.each(this.addOne);
            this.observer.trigger('addAll:composite', this);
            return this;
        },

        selectable: function(spec) {
            if (this.$componentCollection) {
                if (spec) {
                    this.$componentCollection.selectable(spec);
                } else {
                    this.$componentCollection.selectable();
                }
            }
            return this;
        },

        sortable: function(spec) {
            var options = _.defaults(spec || {}, {
                helper: 'clone',
                handle: '.handle',
                placeholder: 'ui-state-highlight'
            });
            if (this.$componentCollection) {
                this.$componentCollection.sortable(options);
            }
            return this;
        }

    });

    return CompositeComponentView;
});
