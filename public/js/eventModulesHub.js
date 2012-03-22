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
    var $body = $('body').on('keydown', _.bind(function(e) {
        if (e.which === 40) {
            e.preventDefault();
            mediator.trigger('downArrow:keyboard', e);
        } else if (e.which === 38) {
            e.preventDefault();
            mediator.trigger('upArrow:keyboard', e);
        }
    }, mediator));

    //: proxy/handle all events that modalEditorView triggers to mediator
    mediator.proxyAllEvents(modalEditorView);
    //: we leave the `selectComponent` function in eventModulesHub since
    //: it is the function that caches _prevClickedView(instead of the individual event handlers
    //: needing to cache it individually..leftclick, rightclick etc)
    var selectComponent = function(spec) {
        componentDetailView.render(spec);
        treeViewUtils.hightlightComponent(spec, _prevClickedView);
        //console.log('pos: ' + spec.viewContext.$el.position().top);
        //: we cache the current selected View Component to _prevClickedView so that
        //: on the next selection we know which component we need to reset(highlighting etc..)
        _prevClickedView = spec.viewContext;
    };

    mediator.on('downArrow:keyboard', 'keyboardDownArrowHandler', function(e) {
        treeViewUtils.traverseTreeDown(e, _prevClickedView);
    });

    mediator.on('upArrow:keyboard', 'keyboardUpArrowHandler', function(e) {
        treeViewUtils.traverseTreeUp(e, _prevClickedView);
    });

    mediator.on('scroll', 'docTreeScrollHandler', function(spec) {
        //console.log(spec.viewContext.$el.scrollTop());
    });

    mediator.on('leftClick:leaf', 'leafLeftClickHandler', function(spec) {
        componentEditorView.saveInput();
        componentEditorView.render(spec);
        selectComponent(spec);
    });

    mediator.on('leftClick:composite', 'compositeLeftClickHandler', function(spec) {
        componentEditorView.saveInput();
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
