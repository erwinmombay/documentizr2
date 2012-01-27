exports.index = function(req, res) {
    res.render('index', {
        title: 'Shipping Tree Demo'
    });
};

exports.items = function(req, res) {
    res.contentType('json');
    res.send(JSON.stringify([{
        'HL': 'blah*blah'
    },
    {
        'HL': 'blah*blah'
    },
    {
        'HL': 'blah*blah'
    }]));
};

