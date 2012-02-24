define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        initialize: function(options) {
            _.bindAll(this, 'validate');
            //: TODO remove options when we finally pass in a true spec
            this.blueprint = options && options.blueprint;
        },

        validate: function() {
            if (this.blueprint && this.blueprint.valdation) {
                this.blueprint.validation.call(this);
            }
        }
    });
    return ComponentModel;
});