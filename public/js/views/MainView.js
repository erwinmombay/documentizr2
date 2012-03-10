define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var appEventMediator = require('views/appEventMediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            //this.data = bootstrapData;
            this.mediator = appEventMediator;
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView,
                //schema: this.data,
                root: 'TS_810'
            });
            this.doctree.componentCollection.fetch({ success: this.doctree.render });
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            //$('#content').append(this.spinner);
            return this;
        }
    });

    return MainView;
});
