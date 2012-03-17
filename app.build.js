({
    //appDir: 'public',
    baseUrl: 'public/js/',
    name: 'main',
    //dir: 'public-build',
    out: 'public/js/main-build.js',
        paths: {
        order: 'libs/require/order.min',
        jquery: 'libs/jquery/jquery-1.7.1.min',
        jqueryui: 'libs/jquery/jquery-ui-1.8.17.custom.min',
        underscore: 'libs/underscore/underscore.min',
        backbone: 'libs/backbone/backbone.min',
        handlebars: 'libs/handlebars/handlebars-1.0.0.beta.4',
        text: 'libs/require/text.min',
        templates: '../templates',
        models: 'models',
        collections: 'collections',
        utils: 'utils',
        modal: 'libs/bootstrap/bootstrap-modal',
        dropdown: 'libs/bootstrap/bootstrap-dropdown',
        prettify: 'libs/prettify/prettify'
    },
    modules: [{
        name: 'main'
        //include: ['models', 'views', 'collections', 'utils'],
        //exclude: ['order', 'jquery', 'underscore', 'backbone', 'handlebars', 'text', 'tabby', 'tabs']
    }],
    inlineText: true,
    wrap: {
        start: "(function() {",
        end: "}());"
    }

    //, optimizeCss: "standard.keepLines"
    //, cssIn: "public/css/main.css"
    //, cssOut: "public/css/build-main.css"
})

