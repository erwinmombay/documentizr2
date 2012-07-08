/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var eventProxyPermissions = {
        //: careful when adding handlers to `all` since this gets
        //: triggered for all the valid events handled by mediator
        'all': {
        },
        'addOne:tree': {
            'treeAddOneSubViewHandler': true
        },
        'addOne:accordion': {
            'accordionAddOneSubViewHandler': true
        },
        'addOne:accordionGroup': {
            'accordionGroupAddOneSubViewHandler': true
        },
        'downArrow:keyboard': {
            'keyboardDownArrowHandler': true
        },
        'upArrow:keyboard': {
            'keyboardUpArrowHandler': true
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
        },
        'click:dataRepr': {
            'detailDataReprClickHandler': true
        }
    };

    eventProxyPermissions.validateSubscription = function(subscriber, channel) {
        if (!eventProxyPermissions[channel]) {
            return false;
        }
        var test = eventProxyPermissions[channel][subscriber];
        return test === undefined ? false : test;
    };

    return eventProxyPermissions;
});

