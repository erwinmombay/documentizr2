define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var SegmentModel = require('models/SegmentModel');
    var SegmentsCollection = require('collections/SegmentsCollection');
    var modalEditorView = require('views/modalEditorView');

    var mediator = new Backbone.View({
       tagName: 'div', id: 'main-panel',
        className: 'row span12' 
    });
    _.extend(mediator, Backbone.Events);

    mediator.on('drop:composite', function(spec) {
        if (spec.context && spec.event && spec.ui) {
            //: this condition makes sure that when the sortable
            //: inside this current object fires an onDrop event
            //: we dont keep on creating a new segment model
            //: NOTE: this can later be changed to some sort of lookup or a root level query
            //: if needed or deemed better
            if ($(spec.ui.helper).attr('id').substring(0, 3) == 'tvc') {
                return;
            }

            //: create the number of helpers dropped
            for (i = 0; i < spec.ui.helper.length; i++) {
                console.log('adding');
                var model = new SegmentModel();
                model.segments = new SegmentsCollection();
                model.cid = 'tvc-' + model.cid;
                spec.context.segments.add(model);
            }
        }
    });

    mediator.on('click:composite', function(context) {
        modalEditorView.$el.modal('show');
        console.log(context.model.cid);
    });
    return mediator;
});
