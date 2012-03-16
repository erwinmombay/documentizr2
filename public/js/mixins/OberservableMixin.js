define(function() {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ObservableMixin = {
        _observers: [],

        addObserver: function(obs) {
            if (obs && obs.trigger) {
                this._observers.push(obs);
            }
        },

        removeObserver: function(obj) {
        },

        addObservers: function(obsArr) {

        },

        triggerObserver: function(channel) {
        }
    };

    return ObservableMixin;
});
