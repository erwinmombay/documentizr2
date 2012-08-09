/*global $:true, define:true, expect:true, afterEach:true,
  beforeEach:true, it:true, sinon:true, _:true, Backbone:true
 */
define(function(require) {
    describe('visitor', function() {
        var visitor = require('visitor');
        var custom = require('tests/specs/customMatchers');

        beforeEach(function() {
            this.addMatchers(custom);
        });

        it('should be a singletion', function() {
            expect(visitor).toBeSingleton();
        });

        it('should have `undefined` init state', function() {
            expect(visitor.getRoot()).toBeUndefined();
            expect(visitor.getNode()).toBeUndefined();
            expect(visitor.getDepth()).toBeUndefined();
            expect(visitor.getPosition()).toBeUndefined();
        });
        
        describe('#setTarget', function() {

            it('should reset state when calling `setTarget`', function() {
                var test = {};
                visitor.setTarget(test);
                expect(visitor.getRoot()).toBe(test);
                expect(visitor.getNode()).toBe(test);
                expect(visitor.getDepth()).toEqual(0);
                expect(visitor.getPosition()).toEqual(0);
            });
        });
    });
});
