define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.schema = options.schema || {};
            this.editor = options.editor;
            this.root = options.root;
        },

        render: function() {
            TreeView.prototype.render.call(this);
            var root = new ComponentModel({
                name: this.root,
                schema: this.schema[this.root],
                componentCollection: new ComponentCollection()
            });
            this.componentCollection.add(root);
            return this;
        }
    });

    return DocTreeView;
});

