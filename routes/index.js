var pg = require('pg');

var conString = 'postgresql+psycopg2://postgres:1q2w3e@localhost:5432/postgres';

exports.index = function(req, res) {
  res.render('index', {
    title: 'Documentizr2'
  });
};

exports.segments = function(req, res) {
  var db = pg.connect(process.env.DATABASE_URL || conString, function(err, client) {
    var query = client.query('SELECT * FROM "EDIDocDef" ORDER BY doc_table, pos_no');
    var results = [];

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      res.contentType('json');
      res.send(JSON.stringify(results));
    });
  });
};

exports.elements = function(req, res) {
  if (req.query.name) {
    var db = pg.connect(process.env.DATABASE_URL || conString, function(err, client) {
      var query = client.query('SELECT * FROM "SegElemDef" WHERE segment = $1 ORDER BY ref', [req.query.name]);
      var results = [];

      query.on('row', function(row) {
        results.push(row);
      });

      query.on('end', function() {
        res.contentType('json');
        res.send(JSON.stringify(results));
      });
    });
  }
};

