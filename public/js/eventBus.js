/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var eventProxyPermissions = require('eventProxyPermissions');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var mediator = require('mediator');
    var treeViewUtils = require('utils/treeViewUtils');

    var charMap = {
        down: 40,
        up: 38,
        left: 37,
        right: 39
    };

    //: _isInitialTreeRender is a flag used to identify if there are no changes
    //: to the treeview except the original recursive tree walker building the tree.
    //: this is used so that we dont trigger any click events(for highlighting)
    //: on the view objects that we create and only select the root.
    var _isInitialTreeRender = true;

    //: _prevClickedView is the cache of the View Object that we triggered
    //: the last click event on(used for tree traversal, highlighting purposes)
    var _prevClickedView = null;
    
    //: use debouncedFoldToggle on left/right arrow keys so that we dont repeatedly
    //: toggle the node when the user holds down the left/arrow keys
    var debouncedFoldToggle = _.debounce(function() {
        _prevClickedView.foldToggle();
    }, 200, true);

    //: we proxy jquery events a little differently than Backbone events.
    //: we proxy the $body jquery object's keydown event to the anonymous function
    //: but only trigger on mousedown down/up(40/38 respectively) arrow key events.
    var $body = $('body').on('keydown', function(e) {
        if (e.which === charMap.down) {
            e.preventDefault();
            mediator.trigger('downArrow:keyboard', e);
        } else if (e.which === charMap.up) {
            e.preventDefault();
            mediator.trigger('upArrow:keyboard', e);
        } else if (e.which === charMap.left || e.which === charMap.right) {
            if (_prevClickedView.foldToggle) debouncedFoldToggle();
        }
    });

    //: proxy/handle all events that modalEditorView triggers to mediator
    mediator.proxyAllEvents(modalEditorView);
    mediator.proxyAllEvents(componentDetailView);
    //: we leave the `selectComponent` function in eventBus since
    //: it is the function that caches _prevClickedView(instead of the individual event handlers
    //: needing to cache it individually..leftclick, rightclick etc)
    var selectComponent = function(spec) {
        //: TODO readjust componentDetailView scrollpos when the selected element is out of view
        var $detailView = componentDetailView.$el.find('.data-repr.' + spec.ctx.model.schema.fullName);
        //: TODO fix bug where when we are traversing up the tree and are under a segment with a large
        //: number of elements and the offset 100 is not enough to show the bottom field view on the detail screen
        if ($detailView.length) adjustScrollPos($detailView, componentDetailView.$el);
        treeViewUtils.hightlightComponent(spec, _prevClickedView);
        //: we cache the current selected View Component to _prevClickedView so that
        //: on the next selection we know which component we need to reset(highlighting etc..)
        _prevClickedView = spec.ctx;
    };

    var adjustScrollPos = function($selected, $container, yoffset) {
        var curSelectPos = $selected.position().top;
        var curScrollPos = $container.scrollTop();
        var contHeight = $container.height();
        var contTop = $container.position().top;
        //: if else statement that readjusts the doctree's scroll position
        if (curSelectPos > contHeight) {
            $container.scrollTop(curScrollPos + (curSelectPos - contHeight));
        } else if (curSelectPos < contTop) {
            $container.scrollTop(curScrollPos - (contTop - (Math.abs(curSelectPos)) + (contTop / 2)));
        }
    };

    mediator.on('downArrow:keyboard', 'keyboardDownArrowHandler', function(e) {
        treeViewUtils.traverseTreeDown(e, _prevClickedView);
        adjustScrollPos(_prevClickedView.$el, mediator.doctree.$el);
    });

    mediator.on('upArrow:keyboard', 'keyboardUpArrowHandler', function(e) {
        treeViewUtils.traverseTreeUp(e, _prevClickedView);
        adjustScrollPos(_prevClickedView.$el, mediator.doctree.$el);
    });

    mediator.on('leftClick:leaf', 'leafLeftClickHandler', function(spec) {
        componentDetailView.render({ collectionContext: spec.ctx.model.collection });
        selectComponent(spec);
        componentDetailView.$el.find('#field' + spec.ctx.model.cid).select();
    });

    mediator.on('leftClick:composite', 'compositeLeftClickHandler', function(spec) {
        //: optimiziation by delaying the rendering of the elements/leaf nodes until first leftClick on the segment
        if (!spec.ctx.$el.find('li').length) {
            spec.ctx.model.componentCollection.each(function(model) {
                _isInitialTreeRender = false;
                treeViewUtils.createSubViewFromSpec({ model: model, ctx: spec.ctx }, _isInitialTreeRender);
            });
        }
        selectComponent(spec);
        componentDetailView.render({ collectionContext: spec.ctx.model.componentCollection });
        componentDetailView.$el.find('.data-repr:first').select();
    });

    mediator.on('rightClick:leaf', 'leafRightClickHandler', function(spec) {
        selectComponent(spec);
    });

    mediator.on('rightClick:composite', 'compositeRightClickHandler', function(spec) {
        if (!spec.ctx.$el.find('li').length) {
            spec.ctx.model.componentCollection.each(function(model) {
                _isInitialTreeRender = false;
                treeViewUtils.createSubViewFromSpec({ model: model, ctx: spec.ctx }, _isInitialTreeRender);
            });
        }
        selectComponent(spec);
    });

    mediator.on('doubleClick:leaf', 'leafDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
    });

    mediator.on('doubleClick:composite', 'compositeDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
        spec.ctx.foldToggle();
    });

    mediator.on('addOne:composite', 'compositeAddOneSubViewHandler', function(spec) {
        var view = treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender, true);
        if (!_isInitialTreeRender && view) view.$el.trigger({ type: 'mousedown', which: 1 });
    });

    mediator.on('addOne:tree', 'treeAddOneSubViewHandler', function(spec) {
        treeViewUtils.createSubViewFromSpec(spec, _isInitialTreeRender);
        spec.ctx.$el.find('li:first').trigger({ type: 'mousedown', which: 1 });
        treeViewUtils.walkTreeViewModels(spec.model);
    });

    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
        _isInitialTreeRender = false;
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.ctx.model.schema.collection[targetId];
        var model = new ComponentModel({
            name: schema.name, fullName: schema.fullName, schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection(),
            data: 'default'
        });
        spec.ctx.model.componentCollection.add(model);
    });

    //: unused events, document this later on
    //mediator.on('drop:leaf', 'leafDropHandler', function(spec) {});
    //mediator.on('drop:composite', 'compositeDropHandler', function(spec) {});
    //mediator.on('hoverEnter:leaf', 'leafHoverEnterHandler', function(spec) {});
    //mediator.on('hoverExit:leaf', 'leafHoverExitHandler', function(spec) {});
    //mediator.on('hoverEnter:composite', 'compositeHoverEnterHandler', function(spec) {});
    //mediator.on('hoverExit:composite', 'compositeHoverExitHandler', function(spec) {});
});
