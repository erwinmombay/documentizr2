/*global define:true, $:true, Backbone:true, _:true*/
define(function() {
    var ComponentModelVisitor = (function() {
        var _root, _curNode, _depth, _pos, _stack;
        _root = _curNode = _pos = _depth = null;
        _stack = [];
        return {
            init: function() {
                _root = _curNode = _pos = _depth = null;
            },

            setTarget: function(target) {
                _root = _curNode = target;
                _pos = _depth = 0;
                _stack.length = 0;
            },

            getRoot: function() {
                return _root;
            },

            getCurNode: function() {
                return _curNode;
            },

            getCurDepth: function() {
                return _depth;
            },

            getCurPos: function() {
                return _pos;
            },

            parent: function() {
                var len = _stack.length;
                if (len) return _stack[len - 1];
                return null;
            },

            child: function(index) {
                if (_curNode && _curNode.componentCollection) {
                    return _curNode.componentCollection.at(index || 0);
                }
                return null;
            },

            children: function() {
                if (_curNode && _curNode.componentCollection) {
                    return _curNode.componentColletion.models;
                }
                return null;
            },

            up: function() {

            },

            down: function() {
                var child;
                child = _curNode.componentCollection.at(0);
                if (child) {
                    _stack.push(_curNode);
                    _curNode = child;
                }
            },

            prev: function() {

            },

            next: function() {

            }
        };
    }());
    return ComponentModelVisitor;
});
