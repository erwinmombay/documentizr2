define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        constructor: function(options) {
            //: _allowedProperties are the list of properties from options that we want to 
            //: directly attach to this Model object
            var _allowedProperties = ['componentCollection', 'schema'];
            //: _ignoreAttribures are the list of properties from options that we dont want
            //: to turn into Backbone.Model `attributes` 
            var _ignoreAttributes = ['componentCollection', 'schema'];
            _.each(options, function(value, key) {
                if (!this.hasOwnProperty(key) || _.include(_allowedProperties, key)) {
                    this[key] = value;
                }
            }, this);
            var args = [].slice.call(arguments, 0)[0];
            _.each(args, function(value, key) {
                if (_.include(_ignoreAttributes, key)) {
                    delete args[key];
                }
            }, this);
            return Backbone.Model.call(this, args);
        },

        initialize: function(attr) {
            _.bindAll(this, 'destroy');
        },

        destroy: function(options) {
            var i, l;
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
