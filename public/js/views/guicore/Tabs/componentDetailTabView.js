define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var componentDetailTabView = Backbone.View.extend({
        id: 'detail-pane',
        className: 'tab-pane',
        name: 'detail',

        initialize: function() {
            _.bindAll(this, 'render', 'clear');
        },

        //: TODO this should be redone an re optimized for finer grained updates
        //: rerending the whole ul and li's is very expensive on auto update
        render: function(spec) {
            this.$el.empty();
            var $ul = $('<ul/>');
            if (spec.viewContext.model.schema.nodeType === 'element') {
                _.each(spec.viewContext.model.collection.models, function(model) {
                    var $li = $('<li/>').append(JSON.stringify(model.toJSON(), null , 4));
                    $ul.append($li);
                }, this);
            } else {
                _.each(spec.viewContext.model.componentCollection.models, function(value) {
                    var $li = $('<li/>').append(JSON.stringify(value, null, 4));
                    $ul.append($li);
                }, this);
            }
            this.$el.append($ul);
            return this;
        },

        clear: function() {
            this.$el.empty();
            return this;
        }
    });

    return new componentDetailTabView(); 
});
