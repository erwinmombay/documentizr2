define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var validationTabTemplate = require('text!templates/Tabs/ValidationTab.html');

    var componentValidationTabView = Backbone.View.extend({
        el: validationTabTemplate,
        id: 'validation-pane',
        name: 'validation',

        events: {
            'click #save-code': 'saveCode',
            'click #run-code': 'runCode'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'saveCode', 'runCode');
            this.$el.attr('id', this.id);
            this.$code = this.$el.find('#validate-code');
            this.defLeafCode = 'if (this.get("data") !== "default") {\n  alert(this.get("data") + " is not default!"' +
                ');\n} else {\n  alert(this.get("name") + " is still default data.")\n}';
            this.defCompCode = 'if (this.componentCollection.length >= 10) {' +
                '\n  alert(this.get("name") + " has more than or equal to 10 children nodes. ");\n} else ' +
                '{\n  alert(this.get("name") + " only has " + this.componentCollection.length\n + " children nodes.")\n}';
            this._cachedSpec = null;
            this._cachedModel = null;
        },

        render: function(spec) {
            this.$code.empty();
            this._cachedSpec = spec;
            this._cachedModel = spec.viewContext.model;
            //if (spec.viewContext.model.customValidationList.length) {
            //}
            if (this._cachedModel.componentCollection) {
                this.$code.val(this.defCompCode);
            } else {
                this.$code.val(this.defLeafCode);
            }
            return this;
        },

        saveCode: function() {

        },

        runCode: function() {
            try {
                var code = this.$code.val();
                var fn = _.bind(new Function(code), this._cachedModel);
                fn();
            } catch (e) {
                alert('Error: ' + e.message);
            }
        }
    });

    return new componentValidationTabView();
});
