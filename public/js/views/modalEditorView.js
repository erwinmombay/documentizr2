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
            if (!spec) {
                this.$el.empty();
                this.$el.append(template);
                return this;
            }
        }

    });
    return new modalEditorView();
});

