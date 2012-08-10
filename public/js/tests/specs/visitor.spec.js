/*global $:true, define:true, expect:true, afterEach:true,
  beforeEach:true, it:true, sinon:true, _:true, Backbone:true
 */
define(function(require) {
    describe('visitor', function() {
        var visitor = require('visitor');
        var custom = require('tests/specs/customMatchers');
        var ComponentModel = require('models/ComponentModel');
        var ComponentCollection = require('collections/ComponentCollection');
        
        var root, depth1, depth2;

        beforeEach(function() {
            this.addMatchers(custom);
            root = new ComponentModel({
                name: 'root', componentCollection: new ComponentCollection()
            });
            depth1 = [
                new ComponentModel({
                    name: 'depth1_index0', componentCollection: new ComponentCollection()
                }),
                new ComponentModel({ name: 'depth1_index1' }),
                new ComponentModel({ name: 'depth1_index2' })
            ];
            depth2 = [
                new ComponentModel({ name: 'depth2_index0' }),
                new ComponentModel({ name: 'depth2_index1' })
            ];
            root.componentCollection.add(depth1);
            root.componentCollection.at(0)
                .componentCollection.add(depth2);
            visitor.setTarget(root);
        });

        afterEach(function() {
            visitor.init();
        });

        it('should be a singletion', function() {
            expect(visitor).toBeSingleton();
        });
        
        describe('#init', function() {
            it('should have null initial state', function() {
                visitor.init();
                expect(visitor.getRoot()).toBeNull();
                expect(visitor.getCurNode()).toBeNull();
                expect(visitor.getCurDepth()).toBeNull();
                expect(visitor.getCurIndex()).toBeNull();
            });
        });
        
        describe('#setTarget', function() {
            it('should reset state when calling `setTarget`', function() {
                visitor.setTarget(root);
                expect(visitor.getRoot()).toBe(root);
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.getCurDepth()).toEqual(0);
                expect(visitor.getCurIndex()).toEqual(0);
            });
        });

        describe('#child', function() {
            it('should return model on depth 1 index 0 when calling `child` from `root`', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.child()).toBe(depth1[0]);
            });

            it('should return model on depth 1 index 1 when calling `child` with arg index 1 from `root`', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.child(1)).toBe(depth1[1]);
            });
        });

        describe('#parent', function() {
            it('should return null when current node has no parent(is root)', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.parent()).toBeNull();
            });

            it('should return model\'s parent', function() {
                expect(visitor.down(1)).toBe(true);
                expect(visitor.parent()).toBe(root);
            });
        });

        describe('#down', function() {
            it('should go down 1 depth on call to `down` and return true', function() {
                expect(visitor.getCurNode().get('name')).toBe('root');
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode().get('name')).toBe('depth1_index0');
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode().get('name')).toBe('depth2_index0');
            });

            it('should return false when no children can be found and not change current node', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth1[0]);
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth2[0]);
                expect(visitor.down()).toBe(false);
                expect(visitor.getCurNode()).toBe(depth2[0]);
            });
        });

        describe('#up', function() {
            it('should go up 1 depth on call to `up`', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth1[0]);
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth2[0]);
                expect(visitor.up()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth1[0]);
                expect(visitor.up()).toBe(true);
                expect(visitor.getCurNode()).toBe(root);
            });

            it('should return false when there is no parent and not change current node', function() {
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.up()).toBe(false);
                expect(visitor.getCurNode()).toBe(root);
            });
        });


        describe('#next', function() {
            it('it should return null when there is no following sibling', function() {
                expect(visitor.next()).toBe(null);
            });

            it('should return following sibling and move cursor ahead by 1 when `next` is called', function() {
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth1[0]);
                expect(visitor.next()).toBe(depth1[1]);
                expect(visitor.next()).toBe(depth1[2]);
                expect(visitor.next()).toBe(null);
            });
        });

        describe('#prev', function() {
            it('it should return null when there is no preceding sibling', function() {
                expect(visitor.prev()).toBeNull();
            });

            it('should return previous sibling and move cursor behind by 1 when `prev` is called', function() {
                expect(visitor.down()).toBe(true);
                expect(visitor.getCurNode()).toBe(depth1[0]);
                expect(visitor.next()).toBe(depth1[1]);
                expect(visitor.next()).toBe(depth1[2]);
                expect(visitor.next()).toBe(null);
                expect(visitor.prev()).toBe(depth1[1]);
            });

        });
    });
});
