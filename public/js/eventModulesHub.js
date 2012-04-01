define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var eventProxyPermissions = require('eventProxyPermissions');

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
    }, mediator)).on('keyup', _.bind(function(e) {
    }, mediator));

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

    var adjustScrollPos = function(view) {
        var curSelectPos = view.$el.position().top;
        var curScrollPos = mediator.doctree.$el.scrollTop();
        //: if else statement that readjusts the doctree's scroll position
        if  (curSelectPos > 640) {
            mediator.doctree.$el.scrollTop(curScrollPos + 30);
        } else if (curSelectPos < 120) {
            mediator.doctree.$el.scrollTop(curScrollPos - 30);
        }
    };

    mediator.on('downArrow:keyboard', 'keyboardDownArrowHandler', function(e) {
        treeViewUtils.traverseTreeDown(e, _prevClickedView);
        adjustScrollPos(_prevClickedView);
    });

    mediator.on('upArrow:keyboard', 'keyboardUpArrowHandler', function(e) {
        treeViewUtils.traverseTreeUp(e, _prevClickedView);
        adjustScrollPos(_prevClickedView);
    });

    mediator.on('leftClick:leaf', 'leafLeftClickHandler', function(spec) {
        selectComponent(spec);
    });

    mediator.on('leftClick:composite', 'compositeLeftClickHandler', function(spec) {
        //: optimiziation by delaying the rendering of the elements/leaf nodes until first leftClick on the segment
        if (!spec.viewContext.$el.find('li').length) {
            spec.viewContext.model.componentCollection.each(function(model) {
                treeViewUtils.createSubViewFromSpec({ model: model, viewContext: spec.viewContext }, false);
            });
        }
        selectComponent(spec);
    });

    mediator.on('rightClick:leaf', 'leafRightClickHandler', function(spec) {
        selectComponent(spec);
    });

    mediator.on('rightClick:composite', 'compositeRightClickHandler', function(spec) {
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

    mediator.on('addOne:tree', 'treeAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
        spec.viewContext.$el.find('li:first').trigger({ type: 'mousedown', which: 1 });
    });

    mediator.on('addOne:accordion', 'accordionAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
    });

    mediator.on('addOne:accordionGroup', 'accordionGroupAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
    });

    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
        _isInitialTreeRender = false;
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.viewContext.model.schema.collection[targetId];
        var model = new ComponentModel({
            name: schema.name, fullName: schema.fullName, schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection(),
            data: 'default'
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
