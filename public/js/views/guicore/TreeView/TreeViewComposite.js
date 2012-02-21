define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = require('views/guicore/TreeView/AbstractTreeViewComponent');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');
    var compositeTemplate = require('text!templates/TreeView/CompositeTemplate.html');

    var TreeViewComposite = AbstractTreeViewComponent.extend({
        template: compositeTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.collection = options.collection || new Backbone.Collection(); 
            this.collection.on('add', this.addOne); 
            this.template = Handlebars.compile(this.template);
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template({ label: this.model.cid }));
            this.$collection = this.$el.children('.tvc-ul');
            this.$tvcPlusMinus = this.$('.tvc-minus');
            this.addAll();
            return this;
        },

        addOne: function(model) {
            var view = null;
            if (model.segments) {
                view = new TreeViewComposite({ model: model });
            } else {
                view = new TreeViewLeaf({ model: model });
            }
            view.render();
            this.$collection.append(view.el);
        },

        addAll: function () {
            this.collection.each(this.addOne);
        }
    });
    return TreeViewComposite;
});
