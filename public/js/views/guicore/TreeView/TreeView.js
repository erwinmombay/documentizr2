define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var CompositeComponent = require('views/guicore/TreeView/CompositeComponent');
    var LeafComponent = require('views/guicore/TreeView/LeafComponent');
    var DocumentComponentCollection = require('collections/DocumentComponentCollection');

    var TreeView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.componentCollection = options.collection || new DocumentComponentCollection();
            this.componentCollection.bind('add', this.addOne);
            this.observer = options.observer || { trigger: function() { /** no op **/ } };
            this.$componentCollection = $('<ul/>', { 'class': 'tvc' });
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
                view = new CompositeComponent({ model: model, observer: this.observer });
                view.$el.droppable({
                    drop: view.onDrop,
                    greedy: true,
                    accept: '.tvc',
                    tolerance: 'pointer',
                    over: view.onHoverEnter,
                    out: view.onHoverExit
                });
                view.render().$componentCollection
                    .sortable({
                        helper: 'clone',
                        handle: '.handle',
                        placeholder: 'ui-state-highlight'
                    })
                    .selectable();
            } else {
                view = new LeafComponent({ model: model, observer: this.observer });
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
