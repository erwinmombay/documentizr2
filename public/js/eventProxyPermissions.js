define(function(require) {
    'use strict';
    var permissions = {
        'keydown:body': {
            'bodyKeyDownTraverser': true
        },
        'addOne:tree': {
            'treeAddOneSubViewHandler': true    
        },
        'addOne:composite': {
            'compositeAddOneSubViewHandler': true
        },
        'leftClick:leaf': {
            'leafLeftClickHandler': true
        },
        'leftClick:composite': {
            'compositeLeftClickHandler': true
        },
        'rightClick:leaf': {
            'leafRightClickHandler': true
        },
        'rightClick:composite': {
            'compositeRightClickHandler': true
        },
        'middleClick:leaf': {
        },
        'middleClick:composite': {
        },
        'doubleClick:leaf': {
            'leafDoubleClickHandler': true
        },
        'doubleClick:composite': {
            'compositeDoubleClickHandler': true
        },
        'drop:leaf': {
            'leafDropHandler': false
        },
        'drop:composite': {
            'compositeDropHandler': false
        },
        'render:leaf': {
        },
        'render:composite': {
        },
        'clear:leaf': {
        },
        'clear:composite': {
        },
        'optionClick:modalEditor': {
            'modalEditorOptionClickHandler': true
        },
        'show:modalEditor': {
        },
        'hide:modalEditor': {
        },
        'render:modalEditor': {
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

