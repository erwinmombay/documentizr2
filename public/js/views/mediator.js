define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

	var mediator = _.clone(Backbone.Events);

    mediator.on('addOne', function(context) {
        console.log('triggered by ' + context.model.cid);
    });



    return mediator;
});

