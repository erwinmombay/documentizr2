define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        initialize: function(attr) {
            _.bindAll(this, 'destroy');
            if (attr && attr.componentCollection) {
                this.componentCollection = attr.componentCollection;
            }
        },

        destroy: function(options) {
            var that = this, i, l;
            if (this.componentCollection && (options && options.cascade)) {
                for (i = 0, l = this.componentCollection.length; i < l; i++) {
                    this.componentCollection.models[0].destroy();
                }
            }
            Backbone.Model.prototype.destroy.call(this, options);
        }
    });
    return ComponentModel;
});
