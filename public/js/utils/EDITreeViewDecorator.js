define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    
    var TreeViewComposite = require('views/guicore/TreeView/TreeViewComposite');
    var TreeViewLeaf = require('views/guicore/TreeView/TreeViewLeaf');
    
    //: TODO These are not true decorators and are more like
    //: function augmenters, probably need to rethink this more in the future
    
    //: The functions below take in an instance of obj; augments
    //: and returns the instance.
    return {
        Sortable: function(obj) {
            this.obj = obj;
            $(this.obj.el).sortable();
            return this.obj;
        },

        Draggable: function(obj) {
            this.obj = obj;
            this.obj.addOne = _.bind(function(model) {
                var view = null;
                if (model.segments) {
                    view = new TreeViewComposite({ model: model });
                } else {
                    view = new TreeViewLeaf({ model: model });
                }
                $(view.el).draggable({ helper: 'clone' });
                view.render();
                $(this.el).append(view.el);
            }, this.obj);
            return this.obj;
        },

        Droppable: function(obj, dropHandler) {
            if (!dropHandler) { throw Error('No Drop Handler!'); }
            this.obj = obj;
            this.obj.onDrop = _.bind(dropHandler , this.obj);
            $(this.obj.el).droppable({ drop: this.obj.onDrop });
            return this.obj;
        }
    };
});
