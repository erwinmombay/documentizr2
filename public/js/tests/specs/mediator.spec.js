define(function(require) {
    describe('mediator', function() {
        var emitter;
        var mediator = require('mediator');
        var eventProxyPermissions = require('eventProxyPermissions');
        var ComponentModel = require('models/ComponentModel');
        var spy1, spy2;

        beforeEach(function() {
            emitter = _.extend({}, Backbone.Events);
            eventProxyPermissions['custom:event'] = { 'customEventHandler': true };
            spy1 = sinon.spy(emitter, 'trigger');
            spy2 = sinon.spy(mediator, 'trigger');
            mediator.proxyAllEvents(emitter);
        });

        afterEach(function() {
            eventProxyPermissions['custom:event'] = { 'customEventHandler': true };
            emitter.trigger.restore();
            mediator.trigger.restore();
            emitter.off();
            mediator.off();
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

         describe('#proxyAllEvents', function() {
            it('proxies all events from the originating event emitter', function() {
                emitter.trigger('test');
                sinon.assert.calledWithExactly(spy1, 'test');
                sinon.assert.calledWithExactly(spy2, 'test');
                emitter.trigger('test2');
                sinon.assert.calledWithExactly(spy1, 'test2');
                sinon.assert.calledWithExactly(spy2, 'test2');
            });
        });
        
        describe('#on', function() {
            it('subscribes a `customEventHandler` to the `custom:event` channel when custom `on` is invoked', function() {
                var spy3 = sinon.spy();
                mediator.on('custom:event', 'customEventHandler', spy3);
                emitter.trigger('custom:event');
                sinon.assert.calledWithExactly(spy1, 'custom:event');
                sinon.assert.calledWithExactly(spy2, 'custom:event');
                expect(spy3.calledOnce).toBe(true);
            });
        });

        describe('#off', function() {
            it('unsubscribes a `customEventHandler` from the `custom:event` channel when custom `off` ' + 
               'is invoked with `subscriber` passed in while leaving `customEventHandler2` intact', function() {
                var spy3 = sinon.spy();
                var spy4 = sinon.spy();
                eventProxyPermissions['custom:event']['customEventHandler2'] = true;
                //: register 2 event handlers to the the same `custom:event` channel
                mediator.on('custom:event', 'customEventHandler', spy3);
                mediator.on('custom:event', 'customEventHandler2', spy4);
                //: test the custom remove by subsriber behaviour
                mediator.off(null, 'customEventHandler', null, null);
                emitter.trigger('custom:event');
                sinon.assert.calledWithExactly(spy1, 'custom:event');
                sinon.assert.calledWithExactly(spy2, 'custom:event');
                //: we expect that only customEventHandler should not be called
                //: while customEventHandler2 should be called
                expect(spy3.calledOnce).toBe(false);
                expect(spy4.calledOnce).toBe(true);
                //: we make sure that the old off behaviour is intact
                //: by doing a remove by `callback`
                mediator.off(null, null, spy4, null);
                emitter.trigger('custom:event');
                sinon.assert.calledWithExactly(spy1, 'custom:event');
                sinon.assert.calledWithExactly(spy2, 'custom:event');
                expect(spy4.calledTwice).toBe(false);
            });
        });

         describe('#trigger', function() {
            it('proxies a `custom:event` with an extra argument', function() {
                var extraArg = { test: 'test value' };
                emitter.trigger('custom:event', extraArg);
                sinon.assert.calledWithExactly(spy1, 'custom:event', { test: 'test value' });
                sinon.assert.calledWithExactly(spy2, 'custom:event', { test: 'test value' });
            });
        });
    });
});
