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
    };

    //: code copied from Backbonejs source code and modified
    //: to take into account subscriber name
    mediator.off = function(events, subscriber, callback, context) {
        var event, calls, node, tail, cb, ctx, name;

        if (!(calls = this._callbacks)) return;
        if (!(events || subscriber || callback || context)) {
            delete this._callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : _.keys(calls);
        while (event = events.shift()) {
            node = calls[event];
            delete calls[event];
            if (!node || !(subscriber || callback || context)) continue;
            tail = node.tail;
            while ((node = node.next) !== tail) {
                cb = node.callback;
                ctx = node.context;
                name = node.name;
                if ((subscriber && name !== subscriber) || (callback && cb !== callback) || (context && ctx !== context)) {
                    this.on(event, name, cb, ctx);
                }
            }
        }
        return this;
    };

    mediator.trigger = function(events) {
        //: code copied from Backbonejs source code and modified
        //: to check for permissions during run time(so permissions can be toggled
        //: on and off even after the original subscription permissions setting)
        var event, node, calls, tail, args, all, rest;
        if (!(calls = this._callbacks)) return this;
        all = calls['all'];
        (events = events.split(/\s+/)).push(null);

        while (event = events.shift()) {
            if (all && eventProxyPermissions['all'][all.next.name]) {
                events.push({next: all.next, tail: all.tail, event: event});
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

    mediator.proxyAllEvents = function(obj) {
        if (obj && obj.on) {
            obj.on('all', function() { mediator.trigger.apply(mediator, arguments); });
        }
    };

    return mediator;
});
