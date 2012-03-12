define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var SegmentComponentView = require('views/guicore/DocTreeView/SegmentComponentView');
    var DocCompositeComponentView = require('views/guicore/DocTreeView/DocCompositeComponentView');
    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');


    var appEventMediator, mediator;
    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    appEventMediator = mediator = _.extend({}, Backbone.Events);

    mediator.changeComponentColorReq = function(view) {
        if (view.model.get('schema').req === 'M' ||
            _.include(['810', 'Table_1', 'Table_2', 'Table_3'], view.model.get('schema').name)) {
            view.$el.find('.tvc-label').css({ 'color': 'red' });
        }
    };

    mediator.createViewFromSpec = function(spec) {
        var view = null;
        console.log(spec.model);
        if (spec.model && spec.model.componentCollection) {
            view = new SegmentComponentView({
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
            mediator.changeComponentColorReq(view);
        } else {
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
        spec.viewContext.$componentCollection.append(view.el);
    };

    mediator.on('drop:composite', function(spec) {
    });

    mediator.on('leftClick:segment', function(spec) {
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
        mediator.createViewFromSpec({ viewContext: spec.viewContext, model: spec.model });
    });

    modalEditorView.on('optionClick:modalEditor', function(spec) {
        var targetId = $(spec.event.target).attr('id');
        var schema = spec.viewContext.model.get('schema').collection[targetId];
        var model = new ComponentModel({
            name: schema.name,
            fullName: schema.fullName,
            schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection() || null
        });
        spec.viewContext.model.componentCollection.add(model);
    });

    return mediator;
});
