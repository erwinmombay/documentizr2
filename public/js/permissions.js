define(function(require) {
    var permissions = {
        
    };

    permissions.validate = function(subscriber, channel) {
        if (!permissions[channel]) {
            return false;
        }
        var test = permissions[channel][subscriber];
        return test === undefined ? false : test;
    };

    return permissions;
});

