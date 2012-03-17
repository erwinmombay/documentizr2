define(function(require) {
    'use strict';
    var treeCursor = {};

    var _cachedTreeViewPos = view;

    treeCursor.at = function(view) {
        _cachedTreeViewPos = view;
    };

    treeCursor.next = function() {
        _cachedTreeViewPos = view;
        return _cachedTreeViewPos;
    }
    return treeCursor;
});
