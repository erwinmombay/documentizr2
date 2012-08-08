/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            this.schema = options.schema || null;
            this.rootName = options.rootName;
            this.rootFullName = options.rootFullName;
        },

        bindEventHandlers: function() {
            TreeView.prototype.bindEventHandlers.call(this);
            this.componentCollection.on('reset', this.render, this);
        },

        render: function() {
            TreeView.prototype.render.call(this);
            return this;
        }
    });

    return DocTreeView;
});

