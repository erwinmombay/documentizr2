define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var spinner = require('text!templates/spinner.html');

    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.schema = options.schema || null;
            this.editor = options.editor;
            this.root = options.root;
            //: on create display a spinner since DocTreeView
            //: does an ajax fetch for its content
            this.$el.append(Handlebars.compile(spinner));
        },

        render: function(data) {
            TreeView.prototype.render.call(this);
            return this;
        }
    });

    return DocTreeView;
});

