var express = require('express');
var routes = require('./routes');

var app = module.exports = express.createServer();
//var io = require('socket.io').listen(app);
var db = require('./database');
var pgClient = db.pgClient;
//var redClient = db.redClient;


// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.se(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/document', routes.getdocument);

app.post('/component', routes.component);

app.listen(process.env.PORT || 5000);
console.log("Express server listening on port %d in %s mode",
            app.address().port, app.settings.env);


//: redis stuff
//redClient.on('error', function(err) {
    //console.log('Error ' + err);
//});

//: socketio stuff

//: stack cedar does not support websockets
//: code below forces io to use long polling
//io.configure(function() {
	//io.set('transports', ['xhr-polling']);
	//io.set('polling duration', 15);
//});

//io.sockets.on('connection', function (socket) {
    //socket.on('register', function (data) {

    //});
//});
