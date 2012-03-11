define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var appEventMediator = require('appEventMediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'walkTreeView');
            this.mediator = appEventMediator;
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView,
                rootFullName: 'TS_810',
                rootName: '810'
            }).render();
            this.doctree.componentCollection.fetch({
                context: this.doctree,
                success: _.bind(function() {
                    this.walkTreeView(this.doctree.componentCollection);
                }, this)
            });
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            return this;
        },

        walkTreeView: function(model) {
            console.log(model);
        }
    });

    return MainView;
});
