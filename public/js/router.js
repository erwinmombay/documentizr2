/**
 * router.js
 * ~~~~~~~~~~~~~~
 * handles hash fragment/history api routing for our app
 *
 * @author erwin.mombay
 */

/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var mediator = require('mediator');
    var mainView = require('views/mainView');

    var Router = Backbone.Router.extend({
        routes: {
            '': ''
        },

        initialize: function() {
            mainView.render();
        }
    });
    return Router;
});

