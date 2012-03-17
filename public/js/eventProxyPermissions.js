define(function(require) {
    var permissions = {
        'addOne:tree': {
            'treeAddOneSubViewHandler': true    
        },
        'addOne:composite': {
            'compositeAddOneSubViewHandler': true
        },
        'doubleClick:composite': {
            'compositeDoubleClickHandler': true
        },
        'doubleClick:leaf': {
            'leafDoubleClickHandler': true
        },
        'leftClick:composite': {
            'compositeLeftClickHandler': true
        },
        'leftClick:leaf': {
            'leafLeftClickHandler': true
        },
        'drop:composite': {
            'compositeDropHandler': false
        },
        'optionClick:modalEditor': {
            'modalEditorOptionClickHandler': true
        }
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

