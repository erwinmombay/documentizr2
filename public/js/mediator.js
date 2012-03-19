/**
 *
 *
 */
define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var eventProxyPermissions = require('eventProxyPermissions');

    //: we mixin Backbone.Events to turn the mediator object
    //: into a Events Proxy Hub for our application
    var mediator = _.extend({}, Backbone.Events);

    mediator.on = function(events, subscriber, callback, context) {
        //: code copied from Backbonejs source code and modified
        //: to store subscriber name
        if (eventProxyPermissions.validateSubscription(subscriber, events)) {
            var ev;
            events = events.split(/\s+/);
            var calls = this._callbacks || (this._callbacks = {});
            while (ev = events.shift()) {
                var list  = calls[ev] || (calls[ev] = {});
                var tail = list.tail || (list.tail = list.next = {});
                tail.name = subscriber;
                tail.callback = callback;
                tail.context = context;
                list.tail = tail.next = {};
            }
            return this;
        }
        return this;
    };

    mediator.trigger = function(events) {
        //: code copied from Backbonejs source code and modified
        //: to check for permissions on run time
        var event, node, calls, tail, args, all, rest;
        if (!(calls = this._callbacks)) return this;
        all = calls['all'];
        (events = events.split(/\s+/)).push(null);

        while (event = events.shift()) {
            if (all) {
                console.log('push');
                if (!eventProxyPermissions[event][all.next.name]) {
                    events.push({next: all.next, tail: all.tail, event: event});
                }
            }
            if (!(node = calls[event])) continue;
            if(!eventProxyPermissions[event][node.next.name]) continue;
            events.push({next: node.next, tail: node.tail});
        }

        rest = Array.prototype.slice.call(arguments, 1);
        while (node = events.pop()) {
            tail = node.tail;
            args = node.event ? [node.event].concat(rest) : rest;
            while ((node = node.next) !== tail) {
                node.callback.apply(node.context || this, args);
            }
        }
        return this;
    };

    mediator.proxyAllEvents = function(obj, specificEvent) {
        if (obj && obj.on) {
            obj.on('all', function() { mediator.trigger.apply(mediator, arguments); });
        }
    };

    console.log(mediator);
    return mediator;
});
