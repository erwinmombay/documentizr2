define(function(require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ComponentModel = require('models/ComponentModel');
    var ComponentCollection = require('collections/ComponentCollection');

    var ElementsCollection = Backbone.Collection.extend({
        model: ComponentModel,
        url: '/elements?segment=',
        _segmentsCache: {},

        initialize: function(models, options) {
            _.bindAll(this, 'fetchElements');
        },

        fetchElements: function(spec) {
            var segmentName = view.model.get('name');
            if (!segmentsCache[segmentName]) {
               $.ajax({
                    url: this.url + segmentName,
                    context: view,
                    success: function(data, status, xhr) {
                        console.log(data);
                        var elements = {};
                        _.each(data, function(value) {
                            console.log(value.ref);
                            var elemName = String(value.ref).length < 2 ? '0' + value.ref : value.ref;
                            elements[elemName] = value.element_name;
                        }, this);
                        this.model.set('elements', elements);
                        this_segmentsCache[segmentName] = elements;
                        this.render({
                            callback: function() {
                            }
                        });
                    },
                    error: function(xhr, status, errObj) {
                        alert('an error has occured while requesting elements.');
                    }
                });
            } else {
                view.model.set('elements', this._segmentsCache[segmentName]);
            }
        }
    });
    return ElementsCollection;
});
