define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var TreeViewCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/document',

        initialize: function(models, options) {
            _.bindAll(this);
        },

        parse: function(resp) {
            return [{
                name: this.tree.rootName,
                fullName: this.tree.rootFullName,
                schema: resp[this.tree.rootFullName],
                componentCollection: new ComponentCollection()    
            }];
        }
    });
    return TreeViewCollection;
});
