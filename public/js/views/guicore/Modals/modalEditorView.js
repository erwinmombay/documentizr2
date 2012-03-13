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
            'click a.option': '_onOptionClick'
        },

        initialize: function(options) {
            _.bindAll(this, 'render', 'show', 'hide', '_onOptionClick');
            this._cachedTargetView = null;
        },

        render: function(spec) {
            this.$el.empty();
            this._cachedTargetView = spec.viewContext;
            var template = Handlebars.compile(this.template);
            template = template({ curNode: spec.viewContext.model.get('name') + '. Choose a child node below.' });
            this.$el.append(template);
            var $body = this.$el.find('div.modal-body');
            _.each(spec.viewContext.model.get('schema').collection, function(value) {
                var $link = $('<a/>', {
                    'href': '#',
                    'id': value.fullName || value.name,
                    'class': 'btn option',
                    'text': value.name
                });
                if (value.req === 'M' || _.include(['810', 'Table_1', 'Table_2', 'Table_3'], value.name)) {
                    $link.addClass('btn-danger');
                }
                $body.append($link);
            }, this);
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
            this._cachedTargetView = null;
            return this;
        },

        _onOptionClick: function(e) {
            this.trigger('optionClick:modalEditor', { viewContext: this._cachedTargetView, event: e });
            this.hide();
        }
    }, Backbone.Events);

    return new modalEditorView();
});
