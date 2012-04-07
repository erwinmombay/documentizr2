define(function(require) {
    describe('mediator', function() {
        var permissons, emitter;
        var mediator = require('mediator');
        var ComponentModel = require('models/ComponentModel');

        beforeEach(function() {
            emitter = _.extend({}, Backbone.Events);
            permissions = { 'testEvent': { 'testEventHandler': true } };
        });

        afterEach(function() {
            permissions = { 'testEvent': { 'testEventHandler': true } };
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
        
        it('has a `proxyAllEvents` method', function() {
            expect(_.has(mediator, 'proxyAllEvents')).toEqual(true);
            expect(_.isFunction(mediator.proxyAllEvents)).toBe(true);
        });

         describe('#proxyAllEvents and #trigger', function() {
            var spy1, spy2;

            beforeEach(function() {
                spy1 = sinon.spy(emitter, 'trigger');
                spy2 = sinon.spy(mediator, 'trigger');
                mediator.proxyAllEvents(emitter);
            });

            afterEach(function() {
                emitter.trigger.restore();
                mediator.trigger.restore();
            });

            it('proxies the `all` event', function() {
                emitter.trigger('all');
                sinon.assert.calledWithExactly(spy1, 'all');
                sinon.assert.calledWithExactly(spy2, 'all');
            });

            it('proxies a `custom:event` with an extra argument', function() {
                var extraArg = { test: 'test value' };
                emitter.trigger('custom:event', extraArg);
                sinon.assert.calledWithExactly(spy1, 'custom:event', { test: 'test value' });
                sinon.assert.calledWithExactly(spy1, 'custom:event', { test: 'test value' });
            });
        });

        describe('#on', function() {
            beforeEach(function() {
                mediator.proxyAllEvents(emitter);
            });
            
            afterEach(function() {
                mediator.off();
            });

            it('allows a subscriber to subscribe to a channel', function() {
            });
        });

        describe('#off', function() {
        });

    });
});
