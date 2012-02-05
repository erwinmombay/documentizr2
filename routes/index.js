exports.index = function(req, res) {
    res.render('index', {
        title: 'Shipping Tree Demo'
    });
};

exports.items = function(req, res) {
    res.contentType('json');
    res.send(JSON.stringify([{
        'qty': '23', 'per': '10'
    },
    {
        'qty': '50', 'per': '25'
    },
    {
        'qty': '20', 'per': '10'
    }]));
};

