define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var contextMenuView = require('views/guicore/contextMenuView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var mediator = require('mediator');

    var treeViewUtils = {};

    treeViewUtils.walkTreeViewModels = function(model) {
        var schema, newModel;
        if (model && model.componentCollection && model.schema) {
            _.each(model.schema.collection, function(value) {
                //if (_.include(['Table_1', 'Table_2', 'Table_3'], value.name) ||
                    //_.include(['M', 'M/Z'], value.req)) {
                    schema = model.schema.collection[value.fullName];
                    if (schema && schema.collection) {
                        newModel = new ComponentModel({
                            name: schema.name, fullName: schema.fullName, schema: schema,
                            componentCollection: new ComponentCollection()
                        });
                    } else {
                        newModel = new ComponentModel({
                            name: schema.name, fullName: schema.fullName, schema: schema, data: 'default'
                        });
                    }
                    model.componentCollection.add(newModel);
                    treeViewUtils.walkTreeViewModels(newModel);
                //}
            }, this);
        }
    };

    treeViewUtils.createSubViewFromSpec = function(spec, isInitialTreeRender) {
        var view;
        if ((spec.model.schema.nodeType !== 'e' && isInitialTreeRender) || !isInitialTreeRender) {
            if (spec.model.componentCollection) {
                view = new DocCompositeComponentView({ model: spec.model, id: spec.model.cid });
                view.render().sortable().menu = {
                    'add new node': function(e) {
                        modalEditorView.render({ viewContext: view, event: e }).show();
                    },
                    'delete node': function(e) {
                        view.$el.fadeOut('fast', function() {
                            view.model.destroy({ cascade: true });
                            componentDetailView.render();
                        });
                    }
                };
            } else {
                view = new DocLeafComponentView({ model: spec.model, id: spec.model.cid });
                view.render().menu = {
                    'delete node': function(e) {
                        view.$el.fadeOut('fast', function() {
                            view.model.destroy();
                            componentDetailView.render();
                        });
                    }
                };
            }
            //: we override the normal contextmenu on right click and display our own
            treeViewUtils.bindCustomContextMenu(view);
            //: we proxy/handle all the events `view` triggers to mediator
            mediator.proxyAllEvents(view);
            //: append this new view to the previous viewContext
            //console.log(spec.viewContext.$componentCollection);
            spec.viewContext.$componentCollection.append(view.$el);
            if (view.model.schema.nodeType === 's' && isInitialTreeRender) view.foldToggle();
            return view;
        }
    };

    /**************************************************************
     *                   TreeView DOM utilities                   *
     **************************************************************/

    //: TODO evaluate if this is still needed or if we can extract it out to another
    //: utility location
    //treeViewUtils.checkComponentReq = function(view) {
        //if (_.include(['M', 'M/Z'], view.model.schema.req) ||
            //_.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.schema.name)) {
                //view.$el.find('.tvc-label').css({ 'color': 'red' });
                //return true;
        //}
        //return false;
    //};

    treeViewUtils.bindCustomContextMenu = function(view) {
        view.$el.on('contextmenu', function(e) {
            contextMenuView.render({ viewContext: view, event: e });
            e.preventDefault();
        });
    };

    treeViewUtils.hightlightComponent = function(spec, prevHighlightedView) {
        if (prevHighlightedView) {
            prevHighlightedView.$el.children('div:first').css({ 'background-color': '#FFFFFF' });
        }
        spec.viewContext.$el.children('div:first').css({ 'background-color': '#D9EDF7' });
    };

    treeViewUtils.traverseTreeDown = function(e, prevView) {
        var $next, $children;
        e.preventDefault();
        //: if prevView is a composite then it will have children
        //: we should select its children on arrow down
        $children = prevView.$el.children('ul').filter(':visible').children('li:first');
        //: if prevView doesnt have any children then it is a leaf,
        //: so we should only select its next sibling
        $next = $children.length ? $children : prevView.$el.next();
        //: if there is a next sibling then select it
        if (!$next.length) {
        //: else there is no next sibling and try to traverse parent instead
            $next = prevView.$el.parent('ul').parent('li');
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
            $prev = prevView.$el.parent('ul').parent('li');
        //TODO optimize this.. seems to cause some lag(expected because of heavy dom traversal)
        //: else if check if the previous sibling has any descendant `li` and if it does
        //: select the very last one
        } else {
            $children = $prev.find('li').filter(':visible:last');
            if ($children.length) $prev = $children;
        }
        $prev.trigger({ type: 'mousedown', which: 1 });
    };

    return treeViewUtils;
});
