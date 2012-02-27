/**
 * app.js
 * ~~~~~~~~~~~~~~
 * bootstraps and initializes the application
 *
 * @author erwin.mombay
 */

define(function(require) {
    'use strict';
    var Backbone = require('backbone');
    var Router = require('router');
    return {
        initialize: function() {
            new Router();
            //: always make sure to add root if our app isnt under domain root
            Backbone.history.start({ root: '/public/js/' });
        }
    };
});
