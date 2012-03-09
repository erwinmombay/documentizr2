define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var DocLeafComponentView = require('views/guicore/DocTreeView/DocLeafComponentView');
    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');
    //var modalEditorView = require('views/modalEditorView');

    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    var mediator = _.extend({}, Backbone.Events);
    
    mediator.createViewFromSpec = function(spec) {
        var view = null;
        if (spec.model && spec.model.componentCollection) {
            view = new DocCompositeComponentView({ 
                model: spec.model,
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.render().sortable({ handle: '' });
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
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.render();
            view.menu = { 
                'delete node': function(e) {
                    view.model.destroy();
                }
            };
        }
        if (view.model.get('schema').req === 'M' ||
            _.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.get('schema').name)) {
            view.$el.find('.tvc-label').css({ 'color': 'red' });
        }
        spec.viewContext.$componentCollection.append(view.el);
    };

    mediator.on('drop:composite', function(spec) {
    });

    mediator.on('leftClick:composite', function(spec) {
    });

    mediator.on('rightClick', function(spec) {
    });

    mediator.on('doubleClick:composite', function(spec) {
    });

    mediator.on('doubleClick', function(spec) {
        spec.event.stopPropagation();
        spec.viewContext.foldToggle();
    });

    mediator.on('hoverEnter:composite', function(spec) {
    });

    mediator.on('hoverExit:composite', function(spec) {
    });

    mediator.on('addOne:composite', function(spec) {
        mediator.createViewFromSpec(spec);
    });

    mediator.on('addOne:tree', function(spec) {
        var schema = spec.model.get(spec.viewContext.root);
        var model = new ComponentModel({
            name: schema.name,
            fullName: schema.fullName,
            schema: schema,
            componentCollection: schema.collection && new ComponentCollection() || null
        });
        mediator.createViewFromSpec({ viewContext: spec.viewContext, model: model });
    });

    modalEditorView.on('optionClick:modalEditor', function(spec) {
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.viewContext.model.get('schema').collection[targetId];
        var model = new ComponentModel({
            name: schema.name,
            fullName: schema.fullName,
            schema: schema,
            componentCollection: schema.collection && new ComponentCollection() || null
        });
        //model.save();
        spec.viewContext.model.componentCollection.add(model);
    });

    return mediator;
});
