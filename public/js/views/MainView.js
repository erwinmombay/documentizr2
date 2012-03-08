define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('views/mediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.data = bootstrapData;
            this.mediator = mediator;
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView,
                schema: this.data,
                root: 'TS_810'
            }).render();
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            return this;
        }
    });

    return MainView;
});
