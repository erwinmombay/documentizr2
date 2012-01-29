/**
 * views/guicore/AbstractTreeViewComponent.js
 * ~~~~~~~~~~~~~~~~~~~
 * AbstractTreeViewComponent
 *
 * @author erwin.mombay
 */

define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractTreeViewComponent = Backbone.View.extend({
        tagName: 'li',
        className: 'tvc',

        initialize: function() {
            throw Error('TreeViewComponent is non instantiable.');
        }
    });
    return AbstractTreeViewComponent;
});


