/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
    var LeafTemplate = require('text!templates/TreeView/LeafTemplate.html');

    var LeafComponentView = AbstractComponentView.extend({
        template: LeafTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponentView to
            //: `this` LeafComponentView instance.
            //: this is like calling super() in javascript
            AbstractComponentView.prototype.initialize.apply(this, arguments);
            this._type = 'leaf';
            this.template = Handlebars.compile(options.template || this.template);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.get('name') }));
            this.trigger('render:' + this._type, this);
            return this;
        }
    });

    return LeafComponentView;
});

