({
    baseUrl: 'public/js/',
    name: 'main',
    preserveLicenseComments: true,
    out: 'public/js/main-build.js',
    optimize: 'uglify',
    mainConfigFile: 'public/js/main.js',
    insertRequire: ['main'],
    paths: {
        jquery: 'libs/jquery/jquery-1.7.2.min',
        jqueryui: 'libs/jquery/jquery-ui-1.8.18.custom.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        handlebars: 'libs/handlebars/handlebars',
        text: 'libs/require/text',
        templates: '../templates',
        models: 'models',
        views: 'views',
        collections: 'collections',
        utils: 'utils',
        modal: 'libs/bootstrap/bootstrap-modal'
    }
})

