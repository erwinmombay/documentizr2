/*global define:true, $:true, Backbone:true, _:true*/
define(function() {
    var TsetVisitor = (function() {
        var _root, _currentNode, _depth, _pos;
        return {
            reset: function() {
                _root = _currentNode = _pos = _depth = undefined;
            },

            setTarget: function(target) {
                _root = _currentNode = target;
                _pos = _depth = 0;
            },

            getRoot: function() {
                return _root;
            },

            getNode: function() {
                return _currentNode;
            },
            
            getDepth: function() {
                return _depth;
            },

            getPosition: function() {
                return _pos;
            },

            parent: function() {

            },

            child: function() {
                
            },

            prev: function() {

            },

            next: function() {

            }
        };
    }());
    return TsetVisitor;
});
