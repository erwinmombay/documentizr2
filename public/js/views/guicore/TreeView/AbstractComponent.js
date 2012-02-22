/**
 * views/TreeView/guicore/AbstractTreeViewComponent.js
 * ~~~~~~~~~~~~~~~~~~~
 * AbstractTreeViewComponent
 *
 * @author erwin.mombay
 */

define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var AbstractComponent = Backbone.View.extend({
        tagName: 'li',
        className: 'tvc',

        initialize: function() {
            throw Error('AbstractComponent is non instantiable.');
        }
    });
    return AbstractComponent;
});


