define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var spinner = require('text!templates/Spinner.html');
    var treeViewUtils = require('utils/treeViewUtils');
    
    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            _.bindAll(this);
            this.componentCollection.tree = this;
            this.componentCollection.on('reset', this.render, this);
            this.schema = options.schema || null;
            this.rootName = options.rootName;
            this.rootFullName = options.rootFullName;
            this.$spinner = $(spinner);
            this.$el.append(this.$spinner);
        },

        render: function() {
            TreeView.prototype.render.call(this);
            this.$spinner.remove();
            this.componentCollection.each(this.walkModel);
            return this;
        },

        walkModel: function(model) {
            treeViewUtils.walkTreeViewModels(model);
        }
    });

    return DocTreeView;
});

