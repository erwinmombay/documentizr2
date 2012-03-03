define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        initialize: function(attr) {
            var self = this;
            _.bindAll(this, 'destroy');
            if (attr && attr.componentCollection) {
                this.componentCollection = attr.componentCollection;
            }
            socket.emit('test', { my: this.cid });
            socket.on('response', function(socket) {
                self.cid = socket.my;
                self.set('label', socket.my);
            });
        },

        destroy: function(options) {
            if (this.componentCollection && (options && options.cascade)) {
                for (var i = 0, l = this.componentCollection.length; i < l; i++) {
                    this.componentCollection.models[0].destroy();
                }
            }
            Backbone.Model.prototype.destroy.call(this, options);
        }
    });
    return ComponentModel;
});
