/**
 *
 *
 */
define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var permissions = require('eventProxyPermissions');

    //: we mixin Backbone.Events to turn the mediator object
    //: into a Events Proxy Hub for our application
    var mediator = _.extend({}, Backbone.Events);

    mediator.on = function(channel, subscriber, callback, context) {
        if (permissions.validate(subscriber, channel)) {
            return Backbone.Events.on.call(mediator, channel, callback, context);
        }
        return mediator;
    };

    mediator.proxyAllEvents = function(obj) {
        if (obj && obj.on) {
            obj.on('all', function() {
                mediator.trigger.apply(mediator, arguments);
            });
        }
    };

    return mediator;
});
