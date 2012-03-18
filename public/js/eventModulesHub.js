define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('mediator');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var componentEditorView = require('views/guicore/componentEditorView');
    var contextMenuView = require('views/guicore/contextMenuView');

    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var _isInitialTreeBuild = true;
    var _prevClickedView = null;

    //: we proxy jquery events a little differently than Backbone events.
    //: we proxy the body jquery object's keydown event to the anonymous function
    //: but only trigger on mousedown up/down arrow key events.
    //: we do this proxy so we can control the event through our eventProxyPermissions.
    var $body = $('body').on('keydown', $.proxy(function(e) {
        if (e.which === 40 || e.which === 38) mediator.trigger('keydown:body', e);
    }, mediator));
    //: proxy/handle all events that modalEditorView to mediator
    mediator.proxyAllEvents(modalEditorView);
    
    var createViewFromSpec = function(spec) {
        var view = null;
        if (spec.model.componentCollection) {
            view = new DocCompositeComponentView({ model: spec.model });
            view.render().sortable({ handle: '' }).menu = {
                'add new node': function(e) {
                    modalEditorView.render({ viewContext: view, event: e }).show();
                },
                'delete node': function(e) {
                    view.$el.fadeOut('fast', function() {
                        view.model.destroy({ cascade: true });
                        componentEditorView.clear();
                        componentDetailView.clear();
                    });
                }
            };
        } else {
            view = new DocLeafComponentView({ model: spec.model });
            view.render().menu = {
                'delete node': function(e) {
                    view.$el.fadeOut('fast', function() {
                        view.model.destroy();
                        componentEditorView.clear();
                        componentDetailView.clear();
                    });
                }
            };
        }
        //: change the label color based on requirement
        checkComponentReq(view);
        //: we override the normal contextmenu on right click and display our own
        bindCustomContextMenu(view);
        //: we proxy/handle all the events `view` triggers to mediator
        mediator.proxyAllEvents(view);
        //: append this new view to the previous viewContext
        spec.viewContext.$componentCollection.append(view.el);
        //: only trigger the leftClick event when it isnt the initial set up
        //: to build the tree. the boolean flag _isInitialTreeBuild is reset to false
        //: when the modalEditor is used. (means the user created this node)
        if(!_isInitialTreeBuild) view.$el.trigger({ type: 'mousedown', which: 1 });
    };

    mediator.on('keydown:body', 'bodyKeyDownTraverser', function(e) {
        var $next, $children, $prev;
        //: 40 is down arrow
        if (e.which === 40) {
            e.preventDefault();
            //: if _prevClickedView is a composite then it will have children
            //: we should select its children on arrow down
            $children = _prevClickedView.$el.children('ul:first').children('li:first'); 
            //: if _prevClickedView doesnt have any children then it is a leaf
            //: so we should only select its next sibling
            $next = $children.length ? $children : _prevClickedView.$el.next();
            //: if there is a next sibling then select it
            if ($next.length) {
                $next.trigger({ type: 'mousedown', which: 1 });
            //: else there is no next sibling
            } else {
                //: since there is no next sibling, go to the parent which is `ul` then select
                //: the parent of `ul` which should be the previous `li` (the previous composite node)
                $next = _prevClickedView.$el.parent().parent();
                //: if the _prevClickedView's parent has any sibling then select it, else
                //: go to the parent's parent and select it.
                //: when we hit the bottom of the tree this should turn into a no op since there is no more `next()`
                $next = $next.next().length ? $next.next() : $next.parent().parent().next();
                $next.trigger({ type: 'mousedown', which: 1 });
            }
        //: 38 is up arrow
        } else if (e.which === 38) {
            e.preventDefault();
            //: select the _prevClickedView's previous sibling
            $prev = _prevClickedView.$el.prev();
            //: if previous sibling doesnt exist select the parent's parent(the previous `li`
            if (!$prev.length) {
                $prev = _prevClickedView.$el.parent().parent(); 
            //TODO optimize this.. seems to cause some lag(expected because of heavy dom traversal)
            //: else if check if the previous sibling has any descendant `li` and if it does
            //: select the very last one
            } else {
                $children = $prev.find('li.tvc:last');
                if ($children.length) $prev = $children;
            }
            $prev.trigger({ type: 'mousedown', which: 1 });
        }
    });

    var checkComponentReq = function(view) {
        if (_.include(['M', 'M/Z'], view.model.schema.req) ||
            _.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.schema.name)) {
            view.$el.find('.tvc-label').css({ 'color': 'red' });
            return true;
        }
        return false;
    };

    var bindCustomContextMenu = function(view) {
        view.$el.on('contextmenu', function(e) {
            contextMenuView.render({ viewContext: view, event: e });
            e.preventDefault();
        });
    };

    var highlighter = function(spec) {
        if (_prevClickedView) {
            _prevClickedView.$el.children('div:first').css({ 'background-color': '#F5F5F5' });
        }
        spec.viewContext.$el.children('div:first').css({ 'background-color': '#D9EDF7' });
        _prevClickedView = spec.viewContext;
    };

    var selectComponent = function(spec) {
        componentDetailView.render(spec);
        highlighter(spec);
    };

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
        createViewFromSpec(spec);
    });

    mediator.on('addOne:tree', 'treeAddOneSubViewHandler', function(spec) {
        createViewFromSpec(spec);
        //: we select the root node after creation
        spec.viewContext.$el.children('ul').children('li').trigger({ type: 'mousedown', which: 1 });
    });
    
    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
        _isInitialTreeBuild = false;
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
