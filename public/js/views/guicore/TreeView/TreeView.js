define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');
    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');
    var TreeViewCollection = require('collections/TreeViewCollection');
    var TreeViewTemplate = require('text!templates/TreeView/TreeView.html');

    var TreeView = Backbone.View.extend({
        el: TreeViewTemplate,

        initialize: function(options) {
            _.bindAll(this);
            this.componentCollection = options.componentCollection || new TreeViewCollection();
            this.$componentCollection = null;
            this.bindEventHandlers();
        },

        bindEventHandlers: function() {
            this.componentCollection.on('add', this.addOne);
        },
        
        unbindEventHandlers: function() {
            this.componentCollection.off(null, null, this);
        },
        
        destroy: function() {
            this.remove();
            this.unbindEventHandlers();
            this.off();
        },

        render: function() {
            this.$componentCollection = this.$el;
            this.addAll();
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:tree', { ctx: this, model: model });
        },

        addAll: function() {
            this.componentCollection.each(this.addOne);
        }
    });

    return TreeView;
});
