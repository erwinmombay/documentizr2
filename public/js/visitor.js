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
                _stack.push(target);
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

            prev: function() {

            },

            next: function() {

            }
        };
    }());
    return ComponentModelVisitor;
});
