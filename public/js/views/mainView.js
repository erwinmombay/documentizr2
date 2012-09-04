/**
 * mainView.js
 * ~~~~~~~~~~~~~~
 *
 * @author erwin.mombay
 */

/*global define:true, $:true, Backbone:true, _:true, Handlebars:true, bootstrapData:true*/
define(function(require) {
    'use strict';
    var mediator = require('mediator');
    var eventBus = require('eventBus');

    var ComponentModel = require('models/ComponentModel');

    var ComponentCollection = require('collections/ComponentCollection');

    var DocTreeView = require('views/guicore/DocTreeView/DocTreeView');

    var mainView = Backbone.View.extend({
        initialize: function() {
            this.doctree = new DocTreeView({
                tagName: 'div', id: 'doctree', className: 'tree-panel',
                rootFullName: 'TS_810', rootName: '810'
            });
            mediator.proxyAllEvents(this.doctree);
            //: give mediator direct access to doctree(to trigger scroll when traversing
            //: tree through arrowkeys)
            mediator.doctree = this.doctree;
        },

        render: function() {
            var model = new ComponentModel({
                name: this.doctree.rootName,
                fullName: this.doctree.rootFullName,
                schema: bootstrapData[this.doctree.rootFullName],
                componentCollection: new ComponentCollection()
            });
            this.doctree.render();
            this.$('#sidebar > .sidebar-nav').append(this.doctree.$el);
            this.$('#loader').remove();
            this.$('#app-panel').show();
            this.doctree.componentCollection.add(model);
            this.debugJSON();
            return this;
        },

        debugJSON: function() {
            //: any argument passed will cause debugJSON to not run
            if (!arguments[0]) {
                $.ajax({
                    context: this,
                    url: '/document',
                    success: function(data) {
                        var $pre = $('<pre/>', { 'class': 'prettyprint' });
                        var $code = $('<code/>', { 'class': 'language-js' });
                        $code.append(JSON.stringify(data, null, 4));
                        $('#detail-panel').append($pre.append($code));
                    }
                });
            }
        }
    });

    return new mainView({ el: $('body') });
});
