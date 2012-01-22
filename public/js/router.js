/**
 * router.js
 * ~~~~~~~~~~~~~~
 * handles hash fragment/history api routing for our app
 *
 * @author erwin.mombay
 */

define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AppView = require('views/AppView');

    var Router = Backbone.Router.extend({

        routes: {
            '': ''
        },

        initialize: function() {
            this.app = new AppView({ el: 'div#app-panel' });
            this.app.render();
        }
    });
    return Router;
});

