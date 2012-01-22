exports.index = function(req, res) {
    res.render('index', {
        title: 'Shipping Tree Demo'
    });
};

exports.segments = function(req, res) {
    res.contentType('json');
    res.send(JSON.stringify({
        'TABLE_2': [
            { 'HL_LOOP': 
                { 'HL': 'blah*blah' } 
            }
        ]
    }));
};

