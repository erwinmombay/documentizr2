define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var permissions = require('permissions');

    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    var mediator = _.extend({}, Backbone.Events);
    mediator.on = function(channel, subscriber, callback, context) {
        if (permissions.validate(subscriber, channel)) {
            return Backbone.Events.on.call(mediator, channel, callback, context);
        }
        return mediator;
    };
    return mediator;
});
