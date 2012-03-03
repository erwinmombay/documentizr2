var client = require('../database').client;

exports.index = function(req, res) {
    var results = [];
    var query = client.query('SELECT * FROM "EDIDocDef" ORDER BY doc_table, pos_no LIMIT 100');
    query.on('row', function(row) {
        results.push(row);
        console.log(row);
    });
    query.on('end', function() {
        res.render('index', {
            title: 'Documentizr2',
            data: JSON.stringify(results)
        });
    });
};

exports.segments = function(req, res) {
    var results = [];
    var query = client.query('SELECT * FROM "EDIDocDef" ORDER BY doc_table, pos_no');
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        res.contentType('json');
        res.send(JSON.stringify(results));
    });
};

exports.elements = function(req, res) {
	if (req.query.name) {
        var results = [];
        var query = client.query('SELECT * FROM "SegElemDef" WHERE segment = $1 ORDER BY ref', [req.query.name]);
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            res.contentType('json');
            res.send(JSON.stringify(results));
        });
	}
};

