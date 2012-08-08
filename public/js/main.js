/**
 * main.js
 * ~~~~~~~~~~~~~~~~~~~
 * used to bootstrap requirejs and is the first point of entry into the application
 *
 * @author erwin.mombay
 */

//: we set up aliases for our most frequently used imported files/modules/dir
require.config({
    paths: {
        jquery: 'libs/jquery/jquery-1.7.2.min',
        jqueryui: 'libs/jquery/jquery-ui-1.8.18.custom.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        handlebars: 'libs/handlebars/handlebars',
        text: 'libs/require/text',
        templates: '../templates',
        models: 'models',
        collections: 'collections',
        utils: 'utils',
        modal: 'libs/bootstrap/bootstrap-modal'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

//: we use the order plugin the load the library's synchronously
/*global define: true*/
define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var text = require('text');
    var jqui = require('jqueryui');
    var Handlebars = require('handlebars');
    var modal = require('modal');
    var App = require('app');

    App.initialize();
});
