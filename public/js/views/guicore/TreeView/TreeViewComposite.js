define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var AbstractTreeViewComponent = require('views/guicore/TreeView/AbstractTreeViewComponent');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var SegmentModel = require('models/SegmentModel');
    var compositeTemplate = require('text!templates/TreeView/CompositeTemplate.html');

    var TreeViewComposite = AbstractTreeViewComponent.extend({
        template: compositeTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render', 'addOne', 'addAll');
            this.segments = options.segments || new SegmentsCollection(); 
            this.segments.on('add', this.addOne); 
            this.$el.attr('id', this.model.cid);
        },

        render: function() {
            this.$el.empty();
            var template = Handlebars.compile(this.template);
            this.$el.append(template({ label: this.model.cid }));
            this.$segments = this.$el.children('.tvc-ul');
            this.$tvcPlusMinus = this.$('.tvc-minus');
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
            this.$segments.append(view.el);
        },

        addAll: function () {
            this.segments.each(this.addOne);
        }
    });
    return TreeViewComposite;
});
