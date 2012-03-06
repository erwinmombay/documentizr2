define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');
    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');
    var ComponentCollection = require('collections/ComponentCollection');

    var TreeView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.componentCollection = options.componentCollection || new ComponentCollection();
            this.componentCollection.on('add', this.addOne);
            this.observer = options.observer || { trigger: function() { /** no op **/ } };
            this.contextMenu = options.contextMenu || null;
            this.$componentCollection = $('<ul/>', { 'class': 'tvc' });
        },

        render: function() {
            $(this.el).empty();
            $(this.el).append(this.$componentCollection);
            this.addAll();
            return this;
        },

        addOne: function(model) {
            this.observer.trigger('addOne:tree', { viewContext: this, model: model });
        },

        addAll: function () {
            this.componentCollection.each(this.addOne);
        }
    });

    return TreeView;
});
