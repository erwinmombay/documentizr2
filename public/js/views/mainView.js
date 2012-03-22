/**
 * mainView.js
 * ~~~~~~~~~~~~~~
 *
 * @author erwin.mombay
 */

define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var mediator = require('mediator');
    var controlsView = require('views/controlsView');
    var eventModulesHub = require('eventModulesHub');
    var treeViewUtils = require('utils/treeViewUtils');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var mainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render');
            this.controlsView = controlsView;
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                rootFullName: 'TS_810',
                rootName: '810'
            });
            this.doctree.componentCollection.fetch({
                context: this.doctree,
                success: _.bind(function() {
                    this.doctree.render();
                    treeViewUtils.walkTreeViewModels(this.doctree.componentCollection.at(0));
                }, this)
            });
            mediator.proxyAllEvents(this.doctree);
            //: proxy the jquery scroll event it triggers as well
            this.doctree.$el.on('scroll', _.bind(function(e) {
                this.doctree.trigger('scroll', { viewContext: this.doctree, event: e });
            }, this));
        },

        render: function() {
            this.controlsView.render();
            $('.sidebar-nav').append(this.doctree.el);
            return this;
        },

        debugJSON: function() {
            $.ajax({
                context: this,
                url: '/document',
                success: function(data) {
                    var $pre = $('<pre/>', { 'class': 'prettyprint' });
                    var $code = $('<code/>', { 'class': 'language-js' });
                    $code.append(JSON.stringify(data, null, 4));
                    $('#content').append($pre.append($code));
                }
            });
        }
    });

    return new mainView({ el: 'div#app-panel' });
});
