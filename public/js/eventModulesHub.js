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
                    view.model.destroy({ cascade: true });
                    componentEditorView.clear();
                    componentDetailView.clear();
                }
            };
        } else {
            view = new DocLeafComponentView({ model: spec.model });
            view.render().menu = {
                'delete node': function(e) {
                    view.model.destroy();
                    componentEditorView.clear();
                    componentDetailView.clear();
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
    };

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
            return false;
        });
    };

    var _prevClickedView = null;
    var highlighter = function(spec) {
        if (_prevClickedView) {
            _prevClickedView.$el
                .children('div:first').css({ 'background-color': '#F5F5F5' });
        }
        spec.viewContext.$el
            .children('div:first').css({ 'background-color': '#D9EDF7' });
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
    });
    
    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
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
    mediator.on('drop:leaf', 'leafDropHandler', function(spec) {});
    mediator.on('drop:composite', 'compositeDropHandler', function(spec) {});
    mediator.on('hoverEnter:leaf', 'leafHoverEnterHandler', function(spec) {});
    mediator.on('hoverExit:leaf', 'leafHoverExitHandler', function(spec) {});
    mediator.on('hoverEnter:composite', 'compositeHoverEnterHandler', function(spec) {});
    mediator.on('hoverExit:composite', 'compositeHoverExitHandler', function(spec) {});
});
