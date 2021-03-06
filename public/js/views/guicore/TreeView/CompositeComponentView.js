/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
    var ComponentCollection = require('collections/ComponentCollection');
    var CompositeTemplate = require('text!templates/TreeView/CompositeTemplate.html');

    var CompositeComponentView = AbstractComponentView.extend({
        template: CompositeTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponentView to
            //: `this` CompositeComponent instance.
            //: this is like calling super() in javascript
            AbstractComponentView.prototype.initialize.call(this, options);
            this._type = 'composite';
            this.template = Handlebars.compile(options.template || this.template);
            //: models have componentCollection while views have
            //: $componentCollection which are the dom elements we dynamically attach
            this.$componentCollection = null;
        },

        bindEventHandlers: function() {
            AbstractComponentView.prototype.bindEventHandlers.call(this);
            //: bind the models' componentCollection `add` event to `addOne` 
            //: so that when we add models to the collection
            //: it automatically adds the nested views as well
            this.model.componentCollection.on('add', this.addOne, this);
        },

        unbindEventHandlers: function() {
            AbstractComponentView.prototype.unbindEventHandlers.call(this);
            this.model.componentCollection.off('add', this.addOne, this);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.get('name') }));
            this.$componentCollection = this.$el.children('.tvc-ul');
            this.$tvcHandle = this.$('.handle');
            this.$tvcToggle = this.$tvcHandle.children('i');
            if (this.model.componentCollection) {
                this.addAll();
            }
            this.trigger('render:' + this._type, this);
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:composite', { ctx: this, model: model });
        },

        addAll: function() {
            this.model.componentCollection.each(this.addOne);
            this.trigger('addAll:composite', this);
            return this;
        },

        foldToggle: function() {
            if (this.$tvcToggle.is('.icon-minus')) {
                this.$tvcToggle.removeClass();
                this.$tvcToggle.addClass('icon-plus');
            } else {
                this.$tvcToggle.removeClass();
                this.$tvcToggle.addClass('icon-minus');
            }
            this.$componentCollection.slideToggle('fast');
            this.trigger('foldToggle:composite', this);
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
                helper: 'clone', placeholder: 'ui-state-highlight', delay: 100
            });
            if (this.$componentCollection) {
                this.$componentCollection.sortable(options);
            }
            return this;
        }
    });

    return CompositeComponentView;
});
