var db = require('../database');
var pgClient = db.pgClient;
var redClient = db.redCient;
var utils = require('../utils/schemaUtil');

exports.index = function(req, res) {
    res.render('index', {
        title: 'Documentizr2'
    });
};

exports.getdocument = function(req, res) {
    var results = [];
    var query = pgClient.query('SELECT * FROM "EDIDocDef" ORDER BY doc_table, pos_no');
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
            res.contentType('json');
            //setTimeout(function() {
            res.send(JSON.stringify(utils.buildDocLevelSchema(results)));
            //}, 15000);
    });
};

exports.getelements = function(req, res) {
	if (req.query.name) {
        var results = [];
        var query = pgClient.query('SELECT * FROM "SegElemDef" WHERE segment = $1 ORDER BY ref', [req.query.name]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            res.contentType('json');
            res.send(JSON.stringify(results));
        });
	}
};

exports.setComponent = function(req, res) {

};
