define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var SegmentModel = require('models/SegmentModel');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var modalEditorView = require('views/modalEditorView');
    var treeViewComponentContextMenuView = require('views/treeViewContextMenuView');

    var mediator = new Backbone.View({
       tagName: 'div', id: 'main-panel', className: 'row span12' 
    });
    _.extend(mediator, Backbone.Events);
    var $body = $('body').on('mousedown', function(e) {
        console.log(e.which);  
    });
    mediator.on('drop:composite', function(spec) {
        spec.context.$el.css({ 'border-color': '' });
        if (spec.context && spec.event && spec.ui) {
            //: this condition makes sure that when the sortable
            //: inside this current object fires an onDrop event
            //: we dont keep on creating a new segment model.
            //: NOTE: this can later be changed to some sort of lookup or a root level query.
            if ($(spec.ui.helper).attr('id').substring(0, 3) == 'tvc') {
                return;
            }

            //: make sure to create the number of helpers dropped.
            for (i = 0; i < spec.ui.helper.length; i++) {
                var model = new SegmentModel();
                model.segments = new SegmentsCollection();
                model.cid = 'tvc-' + model.cid;
                spec.context.segments.add(model);
            }
        }
    });

    mediator.on('leftClick:composite', function(spec) {
        console.log('test');  
        spec.context.$el.children('div').addClass('tvc-selected');
        //: toggle the folding when the leftClick target is the $tvcPlusMinus region
        if ($(spec.event.target).is(spec.context.$tvcPlusMinus)) {
            spec.context.foldToggle();
        }
    });

    mediator.on('rightClick:composite', function(spec) {
    });

    mediator.on('doubleClick:composite', function(spec) {
        spec.event.stopPropagation();
    });

    mediator.on('hoverEnter:composite', function(spec) {
        spec.context.$el.css({ 'border-color': 'red' });
    });

    mediator.on('hoverExit:composite', function(spec) {
        spec.context.$el.css({ 'border-color': '' });
    });

    return mediator;
});
