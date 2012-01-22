/**
 * views/guicore/AbstractTreeViewComponent.js
 * ~~~~~~~~~~~~~~~~~~~
 * TreeViewComponent acts as an abstract class that cannot be
 * instanciated directly but has a public getInstance method
 * that can return instances of its subclasses(like a static factory method).
 *
 * @author erwin.mombay
 */

define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var TreeViewComposite = require('views/TreeViewComposite');
    var TreeViewLeaf = require('views/TreeViewLeaf');
    
    var TreeViewComponent = Backbone.View.extend({

        initialize: function() {
            throw('TreeViewComponent is non instancable');
        },

        getInstance: function(type, model) {
            switch(type) {
                case 'composite':
                    return model ? TreeViewComposite({ model: model }) : TreeViewComposite();
                case 'leaf':
                    return model ?  TreeViewLeaf({ model: model }) : TreeViewLeaf();
                default:
                    return;   
            }
        }
    });
    return TreeViewComponent;
});


