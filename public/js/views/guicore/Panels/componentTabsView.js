define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var componentValidationTabView = require('views/guicore/Tabs/componentValidationTabView');
    var componentCustomTabView = require('views/guicore/Tabs/componentCustomTabView');

    var componentTabsView = Backbone.View.extend({
        tabs: [componentValidationTabView, componentCustomTabView],
        initialize: function() {
            _.bindAll(this, 'render', 'renderListItem');
            this.$ul = this.$el.children('ul');
            this.$div = this.$el.children('#tabs-content');
        },

        //: TODO this should be redone an re optimized for finer grained updates
        //: rerending the whole ul and li's is very expensive on auto update
        render: function() {
            _.each(this.tabs, this.renderListItem);
            this.$ul.children('li:first').addClass('active');
            this.$div.children('div:first').addClass('active');
        },

        renderListItem: function(value) {
            this.$ul.append('<li><a href="#' + value.id + '" data-toggle="tab">' + value.name + '</a></li>');
            this.$div.append(value.$el);
        }
    });

    return new componentTabsView({ el: $('#tabs-panel') });
});
