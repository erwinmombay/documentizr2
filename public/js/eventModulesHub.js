define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var componentEditorView = require('views/guicore/componentEditorView');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var mediator = require('mediator');
    var treeViewUtils = require('utils/treeViewUtils');

    //: _isInitialTreeRender is a flag used to identify if there are no changes
    //: to the treeview except the original recursive tree walker building the tree.
    //: this is used so that we dont trigger any click events(for highlighting)
    //: on the view objects that we create and only select the root.
    var _isInitialTreeRender = true;

    //: _prevClickedView is the cache of the View Object that we triggered
    //: the last click event on(used for tree traversal, highlighting purposes)
    var _prevClickedView = null;

    //: we proxy jquery events a little differently than Backbone events.
    //: we proxy the $body jquery object's keydown event to the anonymous function
    //: but only trigger on mousedown down/up(40/38 respectively) arrow key events.
    //: we do this proxy so we can toggle permissions through eventProxyPermissions.
    var $body = $('body').on('keydown', $.proxy(function(e) {
        //: TODO this can be optimized by seperating out the up and down events to
        //: their own individual functions (since we again do an if/else statement 
        //: on the event handler
        if (e.which === 40 || e.which === 38) {
            mediator.trigger('keydown:body', e);
        }
    }, mediator));

    mediator.on('all', 'test', function() { console.log('allz'); });

    //: proxy/handle all events that modalEditorView triggers to mediator
    mediator.proxyAllEvents(modalEditorView);
    //: we leave the `selectComponent` function in eventModulesHub since
    //: it is the function that caches _prevClickedView(instead of the individual event handlers
    //: needing to cache it individually..leftclick, rightclick etc)
    var selectComponent = function(spec) {
        componentDetailView.render(spec);
        treeViewUtils.hightlightComponent(spec, _prevClickedView);
        //: we cache the current selected View Component to _prevClickedView so that
        //: on the next selection we know which component we need to reset(highlighting etc..)
        _prevClickedView = spec.viewContext;
    };

    mediator.on('keydown:body', 'bodyKeyDownHandler', function(e) {
        treeViewUtils.treeClickSelector(e, _prevClickedView);
    });

    mediator.on('leftClick:leaf', 'leafLeftClickHandler', function(spec) {
        componentEditorView.render(spec);
        selectComponent(spec);
    });

    mediator.on('leftClick:composite', 'compositeLeftClickHandler', function(spec) {
        componentEditorView.clear();
        selectComponent(spec);
    });

    mediator.on('rightClick:leaf', 'leafRightClickHandler', function(spec) {
        componentEditorView.render(spec);
        selectComponent(spec);
    });

    mediator.on('rightClick:composite', 'compositeRightClickHandler', function(spec) {
        componentEditorView.clear();
        selectComponent(spec);
    });

    mediator.on('doubleClick:leaf', 'leafDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
    });

    mediator.on('doubleClick:composite', 'compositeDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
        spec.viewContext.foldToggle();
    });

    mediator.on('addOne:composite', 'compositeAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
    });

    mediator.on('addOne:composite', 'test2', function(spec) {
    });

    mediator.on('addOne:composite', 'test1', function(spec) {
    });

    mediator.on('addOne:tree', 'treeAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
        //: we select the root node after creation
        spec.viewContext.$el.children('ul').children('li').trigger({ type: 'mousedown', which: 1 });
    });

    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
        _isInitialTreeRender = false;
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.viewContext.model.schema.collection[targetId];
        var model = new ComponentModel({
            name: schema.name, fullName: schema.fullName, schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection(),
            data: ''
        });
        spec.viewContext.model.componentCollection.add(model);
    });

    //: unused events, document this later on
    //mediator.on('drop:leaf', 'leafDropHandler', function(spec) {});
    //mediator.on('drop:composite', 'compositeDropHandler', function(spec) {});
    //mediator.on('hoverEnter:leaf', 'leafHoverEnterHandler', function(spec) {});
    //mediator.on('hoverExit:leaf', 'leafHoverExitHandler', function(spec) {});
    //mediator.on('hoverEnter:composite', 'compositeHoverEnterHandler', function(spec) {});
    //mediator.on('hoverExit:composite', 'compositeHoverExitHandler', function(spec) {});
});
