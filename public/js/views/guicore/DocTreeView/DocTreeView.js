/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var spinner = require('text!templates/Spinner.html');
    
    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            this.schema = options.schema || null;
            this.rootName = options.rootName;
            this.rootFullName = options.rootFullName;
            this.$spinner = $(spinner);
            this.$el.append(this.$spinner);
        },

        bindEventHandlers: function() {
            TreeView.prototype.bindEventHandlers.call(this);
            this.componentCollection.on('reset', this.render, this);
        },

        render: function() {
            TreeView.prototype.render.call(this);
            this.$spinner.remove();
            return this;
        }
    });

    return DocTreeView;
});

