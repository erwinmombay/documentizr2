({
    //appDir: 'public',
    baseUrl: 'public/js/',
    name: 'main',
    //dir: 'public-build',
    preserveLicenseComments: true,
    out: 'public/js/main-build.js',
    optimize: 'uglify',
        paths: {
        order: 'libs/require/order.min',
        jquery: 'libs/jquery/jquery-1.7.1.min',
        jqueryui: 'libs/jquery/jquery-ui-1.8.17.custom.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        handlebars: 'libs/handlebars/handlebars',
        text: 'libs/require/text.min',
        templates: '../templates',
        models: 'models',
        collections: 'collections',
        utils: 'utils',
        modal: 'libs/bootstrap/bootstrap-modal'
    },
    modules: [{
        name: 'main'
    }]
    //wrap: {
        //start: "(function() {",
        //end: "}());"
    //}
})

