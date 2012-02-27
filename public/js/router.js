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

    var MainView = require('views/MainView');

    var Router = Backbone.Router.extend({
        routes: {
            '': ''
        },

        initialize: function() {
            this.app = new MainView({ el: 'div#app-panel' });
            this.app.render();
        }
    });
    return Router;
});

