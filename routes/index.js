var db = require('../database');
var pgClient = db.pgClient;
var redClient = db.redCient;
var utils = require('../utils/schemaUtil');

exports.index = function(req, res) {
    var results = [];
    var query = pgClient.query('SELECT seg.segment, seg.ref, seg.elem_type, seg.req_des as seg_req_des, seg.element_name, seg.data_type, ' +
        'seg.min_size, seg.max_size, doc.doc_table, doc.loop, doc.loop_rep, doc.pos_no, doc.req_des, ' +
        'doc.parent_loop_pos, doc.document FROM "SegElemDef" as seg LEFT JOIN "EDIDocDef" as doc on seg.segment = doc.segment ' +
        'order by doc.doc_table, doc.pos_no, seg.ref;');
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        res.render('index', {
            title: 'Documentizr2',
            data: JSON.stringify(utils.buildDocLevelSchema(results))
        });
    });
};

exports.getdocument = function(req, res) {
    var results = [];
    var query = pgClient.query('SELECT seg.segment, seg.ref, seg.elem_type, seg.req_des as seg_req_des, seg.element_name, seg.data_type, ' +
        'seg.min_size, seg.max_size, doc.doc_table, doc.loop, doc.loop_rep, doc.pos_no, doc.req_des, ' +
        'doc.parent_loop_pos, doc.document FROM "SegElemDef" as seg LEFT JOIN "EDIDocDef" as doc on seg.segment = doc.segment ' +
        'order by doc.doc_table, doc.pos_no, seg.ref;');
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
