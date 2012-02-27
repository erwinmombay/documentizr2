define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');
    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');
    var ComponentCollection = require('collections/ComponentCollection');
    var contextMenuView = require('views/guicore/TreeView/contextMenuView');

    var TreeView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.componentCollection = options.collection || new ComponentCollection();
            this.componentCollection.bind('add', this.addOne);
            this.observer = options.observer || { trigger: function() { /** no op **/ } };
            this.$componentCollection = $('<ul/>', { 'class': 'tvc' });
            this.contextMenu = contextMenuView;
        },

        render: function() {
            $(this.el).empty();
            $(this.el).append(this.$componentCollection);
            this.addAll();
            return this;
        },

        addOne: function(model) {
            var view = null;
            if (model.componentCollection) {
                view = new CompositeComponentView({
                    model: model,
                    observer: this.observer,
                    contextMenu: this.contextMenu
                });
                view.$el.droppable({
                    drop: view._onDrop,
                    greedy: true,
                    accept: '.tvc',
                    tolerance: 'pointer',
                    over: view._onHoverEnter,
                    out: view._onHoverExit
                });
                view.render().$componentCollection
                    .sortable({
                        helper: 'clone',
                        handle: '.handle',
                        placeholder: 'ui-state-highlight'
                    })
                    .selectable();
            } else {
                view = new LeafComponentView({
                    model: model,
                    observer: this.observer,
                    contextMenu: this.contextMenu
                });
                view.render();
            }
            this.$componentCollection.append(view.el);
        },

        addAll: function () {
            this.componentCollection.each(this.addOne);
        }
    });

    return TreeView;
});
