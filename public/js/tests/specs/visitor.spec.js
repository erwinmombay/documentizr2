/*global $:true, define:true, expect:true, afterEach:true,
  beforeEach:true, it:true, sinon:true, _:true, Backbone:true
 */
define(function(require) {
    describe('visitor', function() {
        var visitor = require('visitor');
        var custom = require('tests/specs/customMatchers');
        var ComponentModel = require('models/ComponentModel');
        var ComponentCollection = require('collections/ComponentCollection');
        
        var root, level1, level2;

        beforeEach(function() {
            this.addMatchers(custom);
            root = new ComponentModel({
                name: 'root', componentCollection: new ComponentCollection()
            });
            level1 = [
                new ComponentModel({
                    name: 'depth1_pos0', componentCollection: new ComponentCollection()
                }),
                new ComponentModel({ name: 'depth1_pos1' }),
                new ComponentModel({ name: 'depth1_pos2' })
            ];
            level2 = [
                new ComponentModel({ name: 'depth2_pos0' }),
                new ComponentModel({ name: 'depth2_pos1' })
            ];
            root.componentCollection.add(level1);
            root.componentCollection.at(0)
                .componentCollection.add(level2);
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
                expect(visitor.getCurPos()).toBeNull();
            });
        });
        
        describe('#setTarget', function() {

            it('should reset state when calling `setTarget`', function() {
                visitor.setTarget(root);
                expect(visitor.getRoot()).toBe(root);
                expect(visitor.getCurNode()).toBe(root);
                expect(visitor.getCurDepth()).toEqual(0);
                expect(visitor.getCurPos()).toEqual(0);
            });
        });

        describe('#child', function() {
            it('should return model on depth 1 index 0 when calling `child` from `root`', function() {
                expect(visitor.getCurNode().get('name')).toBe('root');
                expect(visitor.child().get('name')).toBe('depth1_pos0');
                expect(visitor.child()).toBe(level1[0]);
            });

            it('should return model on depth 1 index 2 when calling `child` with arg pos 2 from `root`', function() {
                expect(visitor.getCurNode().get('name')).toBe('root');
                expect(visitor.child().get('name')).toBe('depth1_pos0');
                expect(visitor.child()).toBe(level1[0]);
            });
        });

        describe('#parent', function() {
            it('should return model\'s parent if there is any', function() {
                expect(visitor.parent()).toBeNull();
                //TODO
            });
        });

        describe('#down', function() {
            it('should go down 1 depth on call to `down`', function() {
                expect(visitor.getCurNode().get('name')).toBe('root');
                visitor.down();
                expect(visitor.getCurNode().get('name')).toBe('depth1_pos0');
                visitor.down();
                expect(visitor.getCurNode().get('name')).toBe('depth2_pos0');
            });
        });
    });
});
