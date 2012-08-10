/*global define:true, $:true, Backbone:true, _:true*/
define(function() {
    var ComponentModelVisitor = (function() {
        var _root, _curNode, _curDepth, _curPos, _stack;
        _root = _curNode = _curPos = _curDepth = null;
        _stack = [];
        return {
            init: function() {
                _root = _curNode = _curPos = _curDepth = null;
            },

            setTarget: function(target) {
                _root = _curNode = target;
                _curPos = _curDepth = 0;
                _stack.length = 0;
            },

            getRoot: function() {
                return _root;
            },

            getCurNode: function() {
                return _curNode;
            },

            getCurDepth: function() {
                return _curDepth;
            },

            getCurPos: function() {
                return _curPos;
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
                var temp = _stack.pop();
                if (temp) {
                    _curNode = temp;
                    return true;
                }
                return false;
            },
            
            //: traverses down, returns true on success, false otherwise
            down: function() {
                var child;
                if (_curNode.componentCollection) {
                    child = _curNode.componentCollection.at(_curPos = 0);
                    if (child) {
                        _stack.push(_curNode);
                        _curNode = child;
                        return true;
                    }
                }
                return false;
            },

            prev: function() {
                var parent = _stack[_stack.length - 1];
                if (_curPos > 0 && parent && parent.componentCollection) {
                    return parent.componentCollection.at(--_curPos);
                }
                return null;
            },

            next: function() {

            }
        };
    }());
    return ComponentModelVisitor;
});
