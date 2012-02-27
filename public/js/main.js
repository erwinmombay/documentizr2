/**
 * main.js
 * ~~~~~~~~~~~~~~~~~~~
 * used to bootstrap requirejs and is the first point of entry into application
 *
 * @author erwin.mombay
 */

//: we set up aliases for our most frequently used imported files/modules/dir
require.config({
    paths: {
        order: 'libs/require/order.min',
        jquery: 'libs/jquery/jquery-1.7.1.min',
        //: firebug causes firefox to hang when using local jquery.min
        //: use jquery cdn instead during development
        //jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
        jqueryui: 'libs/jquery/jquery-ui-1.8.17.custom.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        handlebars: 'libs/handlebars/handlebars-1.0.0.beta.4',
        //modals: 'libs/bootstrap/bootstrap-modal',
        text: 'libs/require/text.min',
        templates: '../templates',
        models: 'models',
        collections: 'collections',
        utils: 'utils',
        modal: 'libs/bootstrap/bootstrap-modal'
    }
});

//: we use the order plugin the load the library's synchronously
define(function(require) {
    'use strict';
    var $ = require('order!jquery');
    var _ = require('order!underscore');
    var Backbone = require('order!backbone');
    var handlebars = require('order!handlebars');
    var jqui = require('order!jqueryui');
    var App = require('order!app');
    var modal = require('order!modal');

    App.initialize();
});
