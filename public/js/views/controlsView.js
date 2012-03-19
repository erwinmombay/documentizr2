define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var eventsProxyPermissions = require('eventProxyPermissions');
    var buttonGroupTemplate = require('text!templates/Controls/ButtonGroup.html');

    var controlsView = Backbone.View.extend({
        events: {
            'click #arrow-key-control': 'arrowKeyControl'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'buildArrowKeyTable', 'arrowKeyControl');
            this.buttonGroupTemplate = Handlebars.compile(buttonGroupTemplate);
            this.$arrowKeyTable = $(this.buildArrowKeyTable());
            this.$arrowKeyControl = this.$arrowKeyTable.find('#arrow-key-control');
        },

        buildArrowKeyTable: function() {
            return this.buttonGroupTemplate({ 
                id: 'arrow-key-control',
                description: 'use up/down arrow keys to navigate tree view?',
                buttons: [
                    { button: 'on', isDefault: true },
                    { button: 'off' }
                ]
            });
        },

        arrowKeyControl: function(e) {
            if (!$(e.target).is('.active')) {
                var $active = this.$arrowKeyControl.find('button.active');
                var $inactive = this.$arrowKeyControl.find('button').not('.active');
                if ($active.text() === 'on') {
                    eventsProxyPermissions['keydown:body'].bodyKeyDownHandler = false;
                } else {
                    eventsProxyPermissions['keydown:body'].bodyKeyDownHandler = true;
                }
                $active.removeClass('active');
                $inactive.addClass('active');
            }
        },

        render: function() {
            this.$el.append(this.$arrowKeyTable);
        }
    });

    return new controlsView({ el: '#control-panel' });
});
