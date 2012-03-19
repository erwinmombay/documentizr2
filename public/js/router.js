/**
 * router.js
 * ~~~~~~~~~~~~~~
 * handles hash fragment/history api routing for our app
 *
 * @author erwin.mombay
 */

define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

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

