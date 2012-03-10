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
    var segmentsCache = {};
    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    appEventMediator = mediator = _.extend({}, Backbone.Events);
    
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
            //: we could treat the Segment as a Composite as well, but since
            //: i think creating a leaf component for each element might get expensive
            //: it might be better treating the segment as a leaf and the elements
            //: as being a properties.
            view = new SegmentComponentView({
                model: spec.model,
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.menu = { 
                'delete node': function(e) {
                    view.model.destroy();
                }
            };
            var segmentName = view.model.get('name'); 
            if (!segmentsCache[segmentName]) {
                $.ajax({
                    url: 'elements?name=' + segmentName,
                    context: view,
                    success: function(data, status, xhr) {
                        var elements = {};
                        _.each(data, function(value) {
                            var elemName = value.ref.length >= 2 ? value.ref : '0' + value.ref;
                            elements[elemName] = value.element_name;
                        }, this);
                        this.model.set('elements', elements);
                        segmentsCache[segmentName] = elements;
                        this.render();
                    },
                    error: function(xhr, status, errObj) {
                        console.log(status);
                    }
                });
            } else {
                view.model.set('elements', segmentsCache[segmentName]);
            }
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
            schema: schema || null,
            componentCollection: schema && schema.collection && new ComponentCollection() || null
        });
        //model.save();
        spec.viewContext.model.componentCollection.add(model);
    });

    return mediator;
});
