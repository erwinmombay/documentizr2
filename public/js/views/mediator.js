define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var LeafComponentView = require('views/guicore/TreeView/LeafComponentView');
    var CompositeComponentView = require('views/guicore/TreeView/CompositeComponentView');
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
            view = new CompositeComponentView({ 
                model: spec.model,
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.render().sortable({ handle: '' });
                view.menu = { 
                'add': function(e) {
                    var qty = 10;
                    var model = new ComponentModel({
                        qty: qty,
                        componentCollection: new ComponentCollection()
                        });
                    view.model.componentCollection.add(model);
                },
                'delete': function(e) {
                    view.model.destroy({ cascade: true });
                }
            };
        } else {
            view = new LeafComponentView({
                model: spec.model,
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.render();
            view.menu = { 
                'delete': function(e) {
                    view.model.destroy();
                }
            };
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

    mediator.on('hoverEnter:composite', function(spec) {
    });

    mediator.on('hoverExit:composite', function(spec) {
    });

    mediator.on('addOne:composite', function(spec) {
        mediator.createViewFromSpec(spec);
    });

    mediator.on('addOne:tree', function(spec) {
        mediator.createViewFromSpec(spec);
    });

    return mediator;
});
