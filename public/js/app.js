/**
 * app.js
 * ~~~~~~~~~~~~~~
 * bootstraps and initializes the application
 *
 * @author erwin.mombay
 */

/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var Router = require('router');
    return {
        initialize: function() {
            new Router();
            //: always make sure to add root if our app isnt under domain root
            Backbone.history.start({ root: '/public/js/' });
        }
    };
});
