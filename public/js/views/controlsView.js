/*global define:true, $:true, Backbone:true, _:true, Handlebars:true*/
define(function(require) {
    'use strict';
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
            _.bindAll(this);
            this.buttonGroupTemplate = Handlebars.compile(buttonGroupTemplate);
            this.$arrowKeyControls = this.buildOnOffButtonGroup({ 
                id: 'arrow-key-control', description: 'use up/down arrow keys to navigate tree view',
                buttons: [{ button: 'on', isDefault: true }, { button: 'off' }]
            });
            this.$arrowKeyControl = this.$arrowKeyControls.find('#arrow-key-control');
        },

        buildOnOffButtonGroup: function(spec) {
            return $(this.buttonGroupTemplate(spec));
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

        render: function() {
            this.$el.append(this.$arrowKeyControls);
        }
    });

    return new controlsView({ el: '#control-panel' });
});
