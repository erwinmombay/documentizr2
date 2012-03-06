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

        events: {
            'click #modal-close': 'hide',
            'click #modal-save': 'hide',
            'click a.option': '_onClick'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'show', 'hide', '_onClick');
        },

        render: function(spec) {
            this.$el.empty();
            var template = Handlebars.compile(this.template);
            this.$el.append(template);
            this.trigger('render:modalEditor');
            return this;
        },

        show: function() {
            this.$el.modal('show');
            this.trigger('show:modalEditor');
            return this;
        },

        hide: function() {
            this.$el.modal('hide');
            this.trigger('show:modalEditor');
            return this;
        },

        _onClick: function(e) {
            this.trigger('click:modalEditor', { contextView: this, event: e });
        }
    }, Backbone.Events);
    return new modalEditorView();
});
