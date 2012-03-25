define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var detailFieldTemplate = require('text!templates/DetailField.html');
    var componentDetailTabViewTemplate = require('text!templates/DetailTab.html');
     
    var componentDetailTabView = Backbone.View.extend({
        name: 'detail',
        id: 'detail-pane',

        el: componentDetailTabViewTemplate,

        initialize: function() {
            _.bindAll(this, 'render', 'clear');
            this.template = Handlebars.compile(detailFieldTemplate);
            this.$el.attr('id', this.id);
            this.$fields = this.$el.find('.span8');
        },

        //: TODO this should be redone and re optimized for finer grained updates
        //: rerending the whole fieldset is very expensive on auto update
        render: function(spec) {
            this.$fields.empty();
            if (spec.viewContext.model.schema.nodeType === 'element') {
                _.each(spec.viewContext.model.collection.models, function(model) {
                    this.$fields.append(
                        this.template({ id: 'd' + model.cid, name: model.get('name'), data: model.get('data') })
                    );
                }, this);
            } else {
                _.each(spec.viewContext.model.componentCollection.models, function(model) {
                    this.$fields.append(
                        this.template({ id: 'd' + model.cid, name: model.get('name'), data: model.get('data') })
                    );
                }, this);
            }
            return this;
        },

        clear: function() {
            this.$fields.empty();
            return this;
        }
    });

    return new componentDetailTabView(); 
});
