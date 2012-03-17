define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('mediator');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');
    var componentDetailView = require('views/guicore/componentDetailView');
    var componentEditorView = require('views/guicore/componentEditorView');

    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    mediator.proxyAllEvents(modalEditorView);

    var checkComponentReq = function(view) {
        if (_.include(['M', 'M/Z'], view.model.schema.req) ||
            _.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.schema.name)) {
            view.$el.find('.tvc-label').css({ 'color': 'red' });
            return true;
        }
        return false;
    };
    
    var createViewFromSpec = function(spec) {
        var view = null;
        if (spec.model && spec.model.componentCollection) {
            view = new DocCompositeComponentView({
                model: spec.model,
                contextMenu: spec.viewContext.contextMenu
            });
            view.render().sortable();
            view.menu = {
                'add new node': function(e) {
                    modalEditorView.render({ viewContext: view, event: e }).show();
                },
                'delete node': function(e) {
                    view.model.destroy({ cascade: true });
                }
            };
        } else {
            view = new DocLeafComponentView({
                model: spec.model,
                contextMenu: spec.viewContext.contextMenu
            }).render();
            //: we could treat the Segment as a Composite as well, but since
            //: i think creating a leaf component for each element might get expensive
            //: it might be better treating the segment as a leaf and the elements
            //: as being a properties.
            view.menu = {
                'delete node': function(e) {
                    view.model.destroy();
                }
            };
        }
        checkComponentReq(view);
        spec.viewContext.$componentCollection.append(view.el);
        mediator.proxyAllEvents(view);
    };

    mediator.on('drop:composite', 'compositeDropHandler', function(spec) {
    });

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

    mediator.on('leftClick:composite', 'compositeLeftClickHandler', function(spec) {
        componentEditorView.clear();
        componentDetailView.render(spec);
        highlighter(spec);
    });

    mediator.on('leftClick:leaf', 'leafLeftClickHandler', function(spec) {
        componentDetailView.render(spec);
        componentEditorView.render(spec);
        highlighter(spec);
    });

    mediator.on('doubleClick:leaf', 'leafDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
    });

    mediator.on('doubleClick:composite', 'compositeDoubleClickHandler', function(spec) {
        spec.event.stopPropagation();
        spec.viewContext.foldToggle();
    });

    mediator.on('hoverEnter:composite', 'compositeHoverEnterHandler', function(spec) {
    });

    mediator.on('hoverExit:composite', 'compositeHoverExitHandler', function(spec) {
    });

    mediator.on('addOne:composite', 'compositeAddOneSubViewHandler', function(spec) {
        createViewFromSpec(spec);
    });

    mediator.on('addOne:tree', 'treeAddOneSubViewHandler', function(spec) {
        createViewFromSpec({ viewContext: spec.viewContext, model: spec.model });
    });
    
    mediator.on('optionClick:modalEditor', 'modalEditorOptionClickHandler', function(spec) {
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.viewContext.model.schema.collection[targetId];
        var model = new ComponentModel({
            name: schema.name,
            fullName: schema.fullName,
            schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection()
        });
        spec.viewContext.model.componentCollection.add(model);
    });
});
