define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var spinner = require('text!templates/Spinner.html');
    
    var DocTreeView = TreeView.extend({
        initialize: function(options) {
            TreeView.prototype.initialize.call(this, options);
            _.bindAll(this, 'render');
            this.schema = options.schema || null;
            this.rootName = options.rootName;
            this.rootFullName = options.rootFullName;
            this.$spinner = $(spinner);
            this.$el.append(this.$spinner);
        },

        render: function() {
            this.$spinner.remove();
            TreeView.prototype.render.call(this);
            return this;
        }
    });

    return DocTreeView;
});

