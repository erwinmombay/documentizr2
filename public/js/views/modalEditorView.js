define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    //var modalTemplate = require('text!templates/ModalEditor.html');

    modalEditorView = new Backbone.View({
        tagName: 'div',
        id: 'modal-editor',
        className: 'modal',
        template: ['<div class="modal-header">',
        '<a class="close" data-dismiss="modal">×</a>',
        '<h3>Modal header</h3>',
        '</div>',
        '<div class="modal-body">',
        '<p>One fine body…</p>',
        '</div>',
        '<div class="modal-footer">',
        '<a href="#" class="btn btn-primary">Save changes</a>',
        '<a href="#" class="btn">Close</a>',
        '</div>'].join(''),

        initialize: function(options) {
            _.bindAll(this, 'render');
            //this.template = Handlebars.compile(this.template);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template);
            $(this.el).modal('toggle');
            return this;
        }

    });
    return modalEditorView;
});

