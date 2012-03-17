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
        template: TreeViewTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.componentCollection = options.componentCollection || new TreeViewCollection();
            this.componentCollection.on('add', this.addOne);
            this.contextMenu = options.contextMenu || null;
            this.template = Handlebars.compile(this.template);
            this.$componentCollection = null;
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template);
            this.$componentCollection = this.$el.children('.tvc-ul');
            this.addAll();
            return this;
        },

        addOne: function(model) {
            this.trigger('addOne:tree', { viewContext: this, model: model });
        },

        addAll: function () {
            this.componentCollection.each(this.addOne);
        }
    });

    return TreeView;
});
