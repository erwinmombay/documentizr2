define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var modalTemplate = require('text!templates/ModalEditor.html');

    var modalEditorView = Backbone.View.extend({
        tagName: 'div',
        id: 'modal-editor',
        className: 'modal fade',
        template: modalTemplate,

        initialize: function(options) {
            _.bindAll(this, 'render');
        },

        render: function(spec) {
            var template = Handlebars.compile(this.template);
            this.$el.append(template);
            this.$el.modal('show');
            return this;
        },

        hide: function() {
            this.$el.modal('hide');
        }
    });
    return new modalEditorView();
});
