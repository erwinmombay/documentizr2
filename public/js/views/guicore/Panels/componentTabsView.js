define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var componentDetailTabView = require('views/guicore/Tabs/componentDetailTabView');
    var componentValidationTabView = require('views/guicore/Tabs/componentValidationTabView');
    var componentCustomTabView = require('views/guicore/Tabs/componentCustomTabView');

    var componentTabsView = Backbone.View.extend({
        tabs: [componentDetailTabView, componentValidationTabView, componentCustomTabView],
        initialize: function() {
            _.bindAll(this, 'render');
            this.$ul = this.$el.children('ul');
            this.$div = this.$el.children('#tabs-content');
        },

        //: TODO this should be redone an re optimized for finer grained updates
        //: rerending the whole ul and li's is very expensive on auto update
        render: function() {
            _.each(this.tabs, function(value) {
                this.$ul.append('<li><a href="#' + value.id + '" data-toggle="tab">' + value.name + '</a></li>');
                this.$div.append(value.$el);
            }, this);
            this.$ul.children('li:first').addClass('active');
            this.$div.children('div:first').addClass('active');
        }
    });

    return new componentTabsView({ el: $('#tabs-panel') });
});
