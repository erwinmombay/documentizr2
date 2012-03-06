define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var utils = require('utils/schemaUtil');
    var mediator = require('views/mediator');
    var contextMenuView = require('views/guicore/contextMenuView');
    var modalEditorView = require('views/guicore/Modals/modalEditorView');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var MainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.data = utils.buildDocLevelSchema(bootstrapData);
            this.mediator = mediator; 
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                classame: 'tree-panel',
                observer: this.mediator,
                contextMenu: contextMenuView,
                schema: this.data,
                root: '810'
            }).render();
        },

        render: function() {
            $('.sidebar-nav').append(this.doctree.el);
            var $pre = $('<pre/>', { 'class': 'prettyprint' });
            var $code = $('<code/>', { 'class': 'language-js' });
            $code.append(JSON.stringify(this.data, null, 4));
            $('.span9').append($pre.append($code));
            modalEditorView.render();
            return this;
        }
    });

    return MainView;
});
