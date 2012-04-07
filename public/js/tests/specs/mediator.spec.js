define(function(require) {
    describe('mediator', function() {
        var mediator = require('mediator');
        var ComponentModel = require('models/ComponentModel');
        var permissions = { 'testEvent': { 'testEventHandler': true } };

        beforeEach(function() {
        });

        it('is a singleton', function() {
            expect(_.isObject(mediator)).toBe(true);
            expect(_.isFunction(mediator)).toBe(false);
            expect(_.isString(mediator)).toBe(false);
            expect(_.isArguments(mediator)).toBe(false);
            expect(_.isDate(mediator)).toBe(false);
            expect(_.isNaN(mediator)).toBe(false);
            expect(_.isNumber(mediator)).toBe(false);
            expect(_.isArray(mediator)).toBe(false);
            expect(_.isElement(mediator)).toBe(false);
        });
        
        describe('#proxyAllEvents', function() {
            it('has a `proxyAllEvents` method', function() {
                expect(_.has(mediator, 'proxyAllEvents')).toEqual(true);
                expect(_.isFunction(mediator.proxyAllEvents)).toBe(true);
            });

            it('proxies the `all` event', function() {

            });

        });

        describe('#on', function() {
        });

        describe('#off', function() {
        });

        describe('#trigger', function() {
        });
    });
});
