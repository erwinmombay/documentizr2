define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        customValidationList: [],
        _allowedProperties: ['componentCollection', 'schema'],
        _ignoredAttributes: ['componentCollection', 'schema'],

        constructor: function(options) {
            //: _allowedProperties are the list of properties from options that we want to 
            //: directly attach to this Model object
            //: _ignoreAttribures are the list of properties from options that we dont want
            //: to turn into Backbone.Model `attributes` 
            var args = [].slice.call(arguments, 0)[0];
            _.each(options, this._allowProperties, this);
            _.each(args, function(value, key) {
                if (_.include(this._ignoredAttributes, key)) delete args[key];
            }, this);
            return Backbone.Model.call(this, args);
        },

        _allowProperties: function(value, key) {
            if (!this.hasOwnProperty(key) && _.include(this._allowedProperties, key)) {
                this[key] = value;
            }
        },

        initialize: function(attr) {
            _.bindAll(this, 'destroy', 'validation');
        },

        destroy: function(options) {
            var i, l;
            if (this.componentCollection && (options && options.cascade)) {
                for (i = 0, l = this.componentCollection.length; i < l; i++) {
                    this.componentCollection.models[0].destroy();
                }
            }
            Backbone.Model.prototype.destroy.call(this, options);
        },

        validation: function() {
            var i, l;
            for (i = 0, l = this.customValidationList.length; i < l; i++) {

            }
        }
    });
    return ComponentModel;
});
