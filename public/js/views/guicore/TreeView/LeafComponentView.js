define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
    var LeafTemplate = require('text!templates/TreeView/LeafTemplate.html');

    var LeafComponentView = AbstractComponentView.extend({
        template: LeafTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponentView to
            //: `this` LeafComponentView instance.
            //: this is like calling super() in javascript
            AbstractComponentView.prototype.initialize.call(this);
            _.bindAll(this, 'render');
            this._type = 'leaf';
            this.observer = options.observer;
            this.$el.attr('id', this.model.cid);
            this.model.on('change', this.render);
            this.contextMenu = options.contextMenu;
        },

        render: function() {
            this.$el.empty();
            var template = Handlebars.compile(this.template); 
            this.$el.append(template({
                label: this.model.cid,
                qty: this.model.get('qty'),
                per: this.model.get('per')
            }));
            return this;
        }
    });

    return LeafComponentView;
});

