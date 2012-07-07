/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var ComponentModel = Backbone.Model.extend({
        _allowedProperties: ['componentCollection', 'schema'],
        _ignoredAttributes: ['componentCollection', 'schema'],

        constructor: function() {
            //: _allowedProperties are the list of properties from options that we want to
            //: directly attach to this Model object
            //: _ignoreAttribures are the list of properties from options that we dont want
            //: to turn into Backbone.Model `attributes`
            var args = [].slice.call(arguments, 0)[0];
            _.each(args, this._allowProperties, this);
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
            _.bindAll(this);
            this.customValidationList = [];
        },

        destroy: function(options) {
            var i, l;
            if (this.componentCollection && (options && options.cascade)) {
                for (i = 0, l = this.componentCollection.length; i < l; i++) {
                    this.componentCollection.models[0].destroy(options);
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
