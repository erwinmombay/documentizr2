define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var contextMenuView = require('views/guicore/contextMenuView');
    var componentEditorView = require('views/guicore/Panels/componentEditorView');
    var componentDetailTabView = require('views/guicore/Tabs/componentDetailTabView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var mediator = require('mediator');

    var treeViewUtils = {};

    treeViewUtils.walkTreeViewModels = function(model) {
        if (model && model.componentCollection && model.schema) {
            _.each(model.schema.collection, function(value) {
                //if (_.include(['Table_1', 'Table_2', 'Table_3'], value.name) ||
                    //_.include(['M', 'M/Z'], value.req)) {
                    var schema = model.schema.collection[value.fullName];
                    var newModel = new ComponentModel({
                        name: schema.name, fullName: schema.fullName, schema: schema || null,
                        componentCollection: schema && schema.collection && new ComponentCollection() || null,
                        data: 'default'
                    });
                    model.componentCollection.add(newModel);
                    treeViewUtils.walkTreeViewModels(newModel);
                //}
            }, this);
        }
    };

    treeViewUtils.createSubViewFromSpec = function(spec, isInitialTreeRender) {
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
                        componentDetailTabView.clear();
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
                        componentDetailTabView.clear();
                    });
                }
            };
        }
        //: we override the normal contextmenu on right click and display our own
        treeViewUtils.bindCustomContextMenu(view);
        //: we proxy/handle all the events `view` triggers to mediator
        mediator.proxyAllEvents(view);
        //: append this new view to the previous viewContext
        spec.viewContext.$componentCollection.append(view.el);
        //: only trigger the leftClick event when it isnt the initial set up
        //: to build the tree. the boolean flag isInitialTreeRender is reset to false
        //: when the modalEditor is used. (means the user created this node)
        if (!isInitialTreeRender) view.$el.trigger({ type: 'mousedown', which: 1 });
        return view;
    };

    /**************************************************************
     *                   TreeView DOM utilities                   *
     **************************************************************/

    treeViewUtils.checkComponentReq = function(view) {
        if (_.include(['M', 'M/Z'], view.model.schema.req) ||
            _.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.schema.name)) {
                view.$el.find('.tvc-label').css({ 'color': 'red' });
                return true;
        }
        return false;
    };

    treeViewUtils.bindCustomContextMenu = function(view) {
        view.$el.on('contextmenu', function(e) {
            contextMenuView.render({ viewContext: view, event: e });
            e.preventDefault();
        });
    };

    treeViewUtils.hightlightComponent = function(spec, prevHighlightedView) {
        if (prevHighlightedView) {
            prevHighlightedView.$el.children('div:first').css({ 'background-color': '#F5F5F5' });
        }
        spec.viewContext.$el.children('div:first').css({ 'background-color': '#D9EDF7' });
    };

    treeViewUtils.traverseTreeDown = function(e, prevView) {
        var $next, $children;
        e.preventDefault();
        //: if prevView is a composite then it will have children
        //: we should select its children on arrow down
        $children = prevView.$el.children('ul.tvc-ul:visible:first').children('li:first');
        //: if prevView doesnt have any children then it is a leaf,
        //: so we should only select its next sibling
        $next = $children.length ? $children : prevView.$el.next();
        //: if there is a next sibling then select it
        if ($next.length) {
            $next.trigger({ type: 'mousedown', which: 1 });
        //: else there is no next sibling and try to traverse parent instead
        } else {
            $next = prevView.$el.parent().parent('li.tvc');
            while ($next.length) {
                if ($next.next().length) {
                    $next = $next.next();
                    break;
                }
                $next = $next.parent().parent('li.tvc');
            }
        }
        if ($next.length) $next.trigger({ type: 'mousedown', which: 1 });
    };

    treeViewUtils.traverseTreeUp = function(e, prevView) {
        var $prev, $children;
        e.preventDefault();
        //: select the prevView's previous sibling
        $prev = prevView.$el.prev();
        //: if previous sibling doesnt exist select the parent's parent(the previous `li`
        if (!$prev.length) {
            $prev = prevView.$el.parent('ul.tvc-ul').parent('li.tvc');
        //TODO optimize this.. seems to cause some lag(expected because of heavy dom traversal)
        //: else if check if the previous sibling has any descendant `li` and if it does
        //: select the very last one
        } else {
            $children = $prev.find('li.tvc:visible:last');
            if ($children.length) $prev = $children;
        }
        $prev.trigger({ type: 'mousedown', which: 1 });
    };

    return treeViewUtils;
});
