define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = Backbone.Model.extend({
        initialize: function(options) {
            _.bindAll(this, 'destroy');
            //: TODO remove options when we finally pass in a true spec
            this.blueprint = options && options.blueprint;
        },

        destroy: function(options) {
            var that = this, i, l;
            if (this.componentCollection && (options && options.cascade)) {
                for (i = 0, l = this.componentCollection.length; i < l; i++) {
                    this.componentCollection.models[0].destroy();
                }
            }
            Backbone.Model.prototype.destroy.call(this);
        }

        //validate: function() {
            //if (this.blueprint && this.blueprint.valdation) {
                //this.blueprint.validation.call(this);
            //}
        //}
    });
    return ComponentModel;
});
