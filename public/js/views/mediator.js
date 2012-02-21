define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var SegmentTreeViewLeaf = require('views/guicore/SegmentTreeView/SegmentTreeViewLeaf');
    var SegmentTreeViewComposite = require('views/guicore/SegmentTreeView/SegmentTreeViewComposite');
    var SegmentModel = require('models/SegmentModel');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var modalEditorView = require('views/modalEditorView');
    var treeViewComponentContextMenuView = require('views/treeViewContextMenuView');

    var mediator = new Backbone.View({
       tagName: 'div', id: 'main-panel', className: 'row span12' 
    });
    //: we mixin Backbone.Events to turn the mediator object
    //: into a message dispatcher while it also listens/subscribes to the
    //: components of the treeview we pass it into.
    _.extend(mediator, Backbone.Events);
    mediator.editor = modalEditorView;
    mediator.editor.render();
    mediator.editor.$el.modal('hide');
    var $body = $('body');
    $body.on('mousedown', function(e) {
    });

    var curContextMenu = null;

    mediator.on('drop:composite', function(spec) {
        //: make sure to reset border since onhover events trigger first
        //: before drop.
        spec.context.$el.css({ 'border-color': '' });

        if (spec.context && spec.event && spec.ui) {
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
                    var itemTreeModel = mediator.itemTree.collection.getByCid(helperCid);
                    //: if the itemTreeModel's qty is not > 0 then do nothing
                    var qty = itemTreeModel.get('qty');  
                    if (qty > 0) {
                        itemTreeModel.set({ qty: 0 });
                        var model = new SegmentModel({ qty: qty });
                        //model.segments = new SegmentsCollection();
                        model.cid = 'st-' + model.cid;
                        spec.context.collection.add(model);
                    }
                }
            }
        }
    });

    mediator.on('leftClick:composite', function(spec) {
        spec.context.$el.children('div').addClass('tvc-selected');
        //: toggle the folding when the leftClick target is the $tvcPlusMinus region
        if ($(spec.event.target).is(spec.context.$tvcPlusMinus)) {
            spec.context.foldToggle();
        }
    });

    mediator.on('rightClick:composite', function(spec) {
    });

    mediator.on('doubleClick:composite', function(spec) {
    });

    mediator.on('hoverEnter:composite', function(spec) {
        //: this if statement handles internal onhover during sort/drag.
        //: we usually just want to return early unless we need to do something.
        if ($(spec.ui.helper).attr('id').substring(0, 2) == 'st') {
            return;
        }
        for (i = 0; i < spec.ui.helper.length; i++) {
            var helperCid = $(spec.ui.helper[i]).attr('id');
            var itemTreeModel = mediator.itemTree.collection.getByCid(helperCid);
            if (itemTreeModel) {
                //: if the itemTreeModel's qty is not > 0 then do nothing
                //: and return early to not waste looping.
                var qty = itemTreeModel.get('qty');  
                if (qty <= 0) {
                    spec.context.$el.css({ 'border-color': 'red' });
                }
            }
        }
    });

    mediator.on('hoverExit:composite', function(spec) {
        spec.context.$el.css({ 'border-color': '' });
    });

    mediator.on('addOneView:composite', function(spec) {
        try {
        var view = null;
        if (spec.model && spec.model.collection) {
            view = new SegmentTreeViewComposite({ 
                model: spec.model,
                subscriber: spec.context.subscriber
            });
            view.$el.droppable({
                drop: view.onDrop,
                greedy: true,
                accept: '.tvc',
                tolerance: 'pointer',
                over: view.onHoverEnter,
                out: view.onHoverExit
            });
            view.render().$collection
                .sortable({
                    helper: 'clone',
                    handle: '.handle',
                    placeholder: 'ui-state-highlight'
                })
                .selectable();
        } else {
            view = new SegmentTreeViewLeaf({
                model: spec.model,
                subscriber: spec.context.subscriber
            });
            view.render();
        }
        spec.context.$collection.append(view.el);
        } catch (e) {
            console.log(e.message);
        }
    });

    return mediator;
});
