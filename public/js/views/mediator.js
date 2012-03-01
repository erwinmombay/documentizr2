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

    var mediator = new Backbone.View({
       tagName: 'div', id: 'main-panel', className: 'row span12' 
    });
    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    _.defaults(mediator, Backbone.Events);
    //mediator.editor = modalEditorView;
    //mediator.editor.render();
    //mediator.editor.$el.modal('hide');

    mediator.on('drop:composite', function(spec) {
        var i;
        //: make sure to reset border since onhover events trigger first
        //: before drop.
        spec.viewContext.$el.css({ 'border-color': '' });

        if (spec.viewContext && spec.event && spec.ui) {
            //: this condition makes sure that when the sortable
            //: inside this current object fires an onDrop event
            //: we dont keep on creating a new segment model.
            //: NOTE: this can later be changed to some sort of lookup or a root level query.
            //: 'st' is shorthand for 'shippingtree'
            if ($(spec.ui.helper).attr('id').substring(0, 2) == 'st') {
                return;
            } else {
                //: make sure to create the number of helpers dropped.
                for (i = 0; i < spec.ui.helper.length; i++) {
                    var helperCid = $(spec.ui.helper[i]).attr('id');
                    var itemTreeModel = mediator.itemTree.componentCollection.getByCid(helperCid);
                    //: if the itemTreeModel's qty is not > 0 then do nothing
                    var qty = itemTreeModel.get('qty');  
                    if (qty > 0) {
                        itemTreeModel.set({ qty: 0 });
                        var model = new ComponentModel({ qty: qty });
                        model.componentCollection = new ComponentCollection();
                        model.cid = 'st-' + model.cid;
                        spec.viewContext.model.componentCollection.add(model);
                    }
                }
            }
        }
    });

    mediator.on('leftClick:composite', function(spec) {
        spec.viewContext.$el.children('div').addClass('tvc-selected');
        //: toggle the folding when the leftClick target is the $tvcPlusMinus region
        if ($(spec.event.target).is(spec.viewContext.$tvcPlusMinus)) {
            spec.viewContext.foldToggle();
        }
    });

    mediator.on('rightClick', function(spec) {
    });

    mediator.on('doubleClick:composite', function(spec) {
    });

    mediator.on('hoverEnter:composite', function(spec) {
        var i;
        //: this if statement handles internal onhover during sort/drag.
        //: we usually just want to return early unless we need to do something.
        if ($(spec.ui.helper).attr('id').substring(0, 2) == 'st') {
            return;
        }
        for (i = 0; i < spec.ui.helper.length; i++) {
            var helperCid = $(spec.ui.helper[i]).attr('id');
            var itemTreeModel = mediator.itemTree.componentCollection.getByCid(helperCid);
            if (itemTreeModel) {
                //: if the itemTreeModel's qty is not > 0 then do nothing
                //: and return early to not waste looping.
                var qty = itemTreeModel.get('qty');  
                if (qty <= 0) {
                    spec.viewContext.$el.css({ 'border-color': 'red' });
                } else {
                    spec.viewContext.$el.css({ 'border-color': 'green' });
                }
            }
        }
    });

    mediator.on('hoverExit:composite', function(spec) {
        spec.viewContext.$el.css({ 'border-color': '' });
    });

    mediator.on('addOne:composite', function(spec) {
        var view = null;
        if (spec.model && spec.model.componentCollection) {
            view = new CompositeComponentView({ 
                model: spec.model,
                observer: spec.viewContext.observer,
                contextMenu: spec.viewContext.contextMenu
            });
            view.$el.droppable({
                drop: view._onDrop,
                greedy: true,
                accept: '.tvc',
                tolerance: 'pointer',
                over: view._onHoverEnter,
                out: view._onHoverExit
            });
            view.render().$componentCollection
                .sortable({
                    helper: 'clone',
                    handle: '.handle',
                    placeholder: 'ui-state-highlight'
                })
                .selectable();
            view.menu = { 
                'add': function(e) {
                    var qty = 10;
                    var model = new ComponentModel({ qty: qty });
                    model.cid = 'st-' + model.cid;
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
    });

    return mediator;
});
