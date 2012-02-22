define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponent = require('views/guicore/TreeView/AbstractComponent');
    var leafTemplate = require('text!templates/TreeView/LeafTemplate.html');

    var LeafComponent = AbstractComponent.extend({
        template: leafTemplate,

        initialize: function(options) {
            //: rebind all the inherited methods from AbstractComponent to
            //: `this` LeafComponent instance.
            AbstractComponent.prototype.initialize.call(this);
            _.bindAll(this, 'render');
            this._type = 'leaf';
            this.observer = options.observer;
            this.$el.attr('id', this.model.cid);
            this.model.on('change', this.render);
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

    return LeafComponent;
});

