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
    var eventModulesHub = require('eventModulesHub');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var mainView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this);
            this.doctree = new DocTreeView({
                tagName: 'div',
                id: 'doctree',
                className: 'tree-panel',
                rootFullName: 'TS_810',
                rootName: '810'
            }).render();
            mediator.proxyAllEvents(this.doctree);
            //: give mediator direct access to doctree(to trigger scroll when traversing 
            //: tree through arrowkeys)
            mediator.doctree = this.doctree;
            var model = new ComponentModel({
                name: this.doctree.rootName,    
                fullName: this.doctree.rootFullName,
                schema: bootstrapData[this.doctree.rootFullName],
                componentCollection: new ComponentCollection()    
            });
            this.doctree.componentCollection.add(model);
        },

        render: function() {
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
