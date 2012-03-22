define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var eventsProxyPermissions = require('eventProxyPermissions');
    var buttonGroupTemplate = require('text!templates/Controls/ButtonGroup.html');
    
    //: TODO fix this. the way e currently create the buttons and listen to changes
    //: is incredibly ugly and clunky and not very extendible.
    var controlsView = Backbone.View.extend({
        events: {
            'click #arrow-key-control': 'arrowKeyControl',
            'click #eager-save-control': 'eagerSaveControl'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'buildArrowKeyTable', 'arrowKeyControl',
                'buildEagerSaveTable', 'eagerSaveControl');
            this.buttonGroupTemplate = Handlebars.compile(buttonGroupTemplate);
            this.$arrowKeyTable = $(this.buildArrowKeyTable());
            this.$eagerSaveTable = $(this.buildEagerSaveTable());
            this.$arrowKeyControl = this.$arrowKeyTable.find('#arrow-key-control');
            this.$eagerSaveControl = this.$eagerSaveTable.find('#eager-save-control');
        },

        buildEagerSaveTable: function() {
            return this.buttonGroupTemplate({ 
                id: 'eager-save-control',
                description: 'auto update on edit',
                buttons: [
                    { button: 'on', isDefault: true },
                    { button: 'off' }
                ]
            });
        },

        buildArrowKeyTable: function() {
            return this.buttonGroupTemplate({ 
                id: 'arrow-key-control',
                description: 'use up/down arrow keys to navigate tree view',
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
                    eventsProxyPermissions['downArrow:keyboard'].keyboardDownArrowHandler = false;
                    eventsProxyPermissions['upArrow:keyboard'].keyboardUpArrowHandler = false;
                } else {
                    eventsProxyPermissions['downArrow:keyboard'].keyboardDownArrowHandler = true;
                    eventsProxyPermissions['upArrow:keyboard'].keyboardUpArrowHandler = true;
                }
                $active.removeClass('active');
                $inactive.addClass('active');
            }
        },

        eagerSaveControl: function(e) {
            if (!$(e.target).is('.active')) {
                var $active = this.$eagerSaveControl.find('button.active');
                var $inactive = this.$eagerSaveControl.find('button').not('.active');
                if ($active.text() === 'on') {
                    eventsProxyPermissions['inputChange:componentEditor'] = true;
                } else {
                    eventsProxyPermissions['inputChange:componentEditor'] = false;
                }
                $active.removeClass('active');
                $inactive.addClass('active');
            }
        },

        render: function() {
            this.$el.append(this.$arrowKeyTable);
            this.$el.append(this.$eagerSaveTable);
        }
    });

    return new controlsView({ el: '#control-panel' });
});
