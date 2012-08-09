require.config({
    baseUrl: '../',
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
        modal: 'libs/bootstrap/bootstrap-modal',
        tests: 'tests'
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
    var handlebars = require('handlebars');
    var modal = require('modal');

    require([
        'tests/specs/mediator.spec',
        'tests/specs/visitor.spec',
        'tests/specs/models/ComponentModel.spec',
        'tests/specs/collections/ComponentCollection.spec',
        'tests/specs/views/TreeView.spec'
    ], function() {
        jasmine.getEnv().addReporter(new jasmine.HtmlReporter());
        jasmine.getEnv().execute();
    });
});

