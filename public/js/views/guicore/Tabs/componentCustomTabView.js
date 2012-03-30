define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var customTabTemplate = require('text!templates/Tabs/CustomTab.html');

    var componentCustomTabView = Backbone.View.extend({
        el: customTabTemplate,
        id: 'custom-pane',
        name: 'custom',

        defCompCode: [
            'var st02 = this.model.componentCollection.where({ "fullName": "ST02" })[0];',
            'var st03 = this.model.componentCollection.where({ "fullName": "ST03" })[0];',
            'var $st03 = this.$el.find(".data-repr.ST03");',
            '',
            'st02.on("change:data", function() {',
            '    if (st02.get("data") !== "default") {',
            '        $st03.css({ "color": "orange" });',
            '    } else {',
            '        $st03.css({ "color": "black" });',
            '    }',
            '}, this);'
        ].join('\n'),

        events: {
            'click #apply-code': 'applyCode'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'applyCode');
            this.$el.attr('id', this.id);
            this.$code = this.$el.find('#custom-code');
        },

        render: function(spec) {
            this.$code.empty();
            this._cachedSpec = spec;
            //if (this._cachedSpec.viewContext.$componentCollection) {
                //this.$code.val(this.defCompCode);
            //} else {
                this.$code.val(this.defCompCode);
            //}
            return this;
        },

        applyCode: function() {
            try {
                var code = this.$code.val();
                var fn = _.bind(new Function(code), this._cachedSpec.viewContext);
                fn();
            } catch (e) {
                alert('Error: ' + e.message);
            }
        }
    });

    return new componentCustomTabView();
});
