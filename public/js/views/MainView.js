define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var ComponentModel = require('models/ComponentModel');
    var TreeView = require('views/guicore/TreeView/TreeView');
    var ComponentCollection = require('collections/ComponentCollection');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.mediator = mediator; 
            this.doctree = new TreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView
            }).render();
            var shipmentHL = new ComponentModel({
                componentCollection: new ComponentCollection()
            });
            this.doctree.componentCollection.add(shipmentHL);
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            return this;
        }
    });

    return MainView;
});
