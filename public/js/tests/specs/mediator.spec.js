/*global $:true, define:true, expect:true, afterEach:true,
  beforeEach:true, it:true, sinon:true, _:true, Backbone:true
 */
define(function(require) {
    'use strict';
    describe('mediator', function() {
        var spy1, spy2, spy3, emitter;
        var mediator = require('mediator');
        var custom = require('tests/specs/customMatchers');
        var eventProxyPermissions = require('eventProxyPermissions');
        var ComponentModel = require('models/ComponentModel');

        beforeEach(function() {
            this.addMatchers(custom);
            emitter = _.extend({}, Backbone.Events);
            eventProxyPermissions['custom:event'] = {
                'customEventHandler1': true,
                'customEventHandler2': true
            };
            mediator.proxyAllEvents(emitter);
        });

        afterEach(function() {
            spy1 = null;
            spy2 = null;
            spy3 = null;
            eventProxyPermissions['custom:event'] = {
                'customEventHandler1': true,
                'customEventHandler2': true
            };
            emitter.off();
            mediator.off();
        });

        it('is a singleton', function() {
            expect(mediator).toBeSingleton();
        });

        it('has a `proxyAllEvents` method', function() {
            expect(_.has(mediator, 'proxyAllEvents')).toEqual(true);
            expect(_.isFunction(mediator.proxyAllEvents)).toBe(true);
        });

        describe('#proxyAllEvents', function() {
            beforeEach(function() {
                spy1 = sinon.spy(emitter, 'trigger');
                spy2 = sinon.spy(mediator, 'trigger');
            });

            afterEach(function() {
                emitter.trigger.restore();
                mediator.trigger.restore();
            });

            it('should proxy all events from the originating event emitter', function() {
                emitter.trigger('test');
                sinon.assert.calledWithExactly(spy1, 'test');
                sinon.assert.calledWithExactly(spy2, 'test');
                emitter.trigger('test2');
                sinon.assert.calledWithExactly(spy1, 'test2');
                sinon.assert.calledWithExactly(spy2, 'test2');
            });
        });

        describe('#on', function() {
            it('should subscribe `customEventHandler1` subscriber to the `custom:event` channel', function() {
                spy1 = sinon.spy();
                mediator.on('custom:event', 'customEventHandler1', spy1);
                emitter.trigger('custom:event');
                sinon.assert.calledOnce(spy1);
            });
        });

        describe('#off', function() {
            beforeEach(function() {
                spy1 = sinon.spy();
                spy2 = sinon.spy();
                mediator.on('custom:event', 'customEventHandler1', spy1);
                mediator.on('custom:event', 'customEventHandler2', spy2);
            });

            it('should unsubsribe "customEventHandler1" subscriber when unsubsribing by `subsriber` name', function() {
                mediator.off(null, 'customEventHandler1', null, null);
                emitter.trigger('custom:event');
                sinon.assert.notCalled(spy1);
                sinon.assert.calledOnce(spy2);
            });

            it('should not unsubscribe "customEventHandler2" when unsubscribing "customEventhandler1" by `subscriber` name', function() {
                mediator.off(null, 'customEventHandler1', null, null);
                emitter.trigger('custom:event');
                sinon.assert.notCalled(spy1);
                sinon.assert.calledOnce(spy2);
            });

            it('should not unsubscribe "customEventHandler2" when unsubscribing "customEventhandler1" by `callback`', function() {
                mediator.off(null, null, spy1, null);
                emitter.trigger('custom:event');
                sinon.assert.notCalled(spy1);
                sinon.assert.calledOnce(spy2);
            });
        });

         describe('#trigger', function() {
            beforeEach(function() {
                spy1 = sinon.spy(emitter, 'trigger');
                spy2 = sinon.spy(mediator, 'trigger');
                spy3 = sinon.spy();
            });

            afterEach(function() {
                emitter.trigger.restore();
                mediator.trigger.restore();
            });

            it('should proxy `custom:event` with extra arguments to "customEventHandler1" when permissions is `true`', function() {
                var extraArg = { test: 'test value' };
                mediator.on('custom:event', 'customEventHandler1', spy3);
                emitter.trigger('custom:event', extraArg);
                sinon.assert.calledWithExactly(spy1, 'custom:event', { test: 'test value' });
                sinon.assert.calledWithExactly(spy2, 'custom:event', { test: 'test value' });
                sinon.assert.calledWithExactly(spy3, { test: 'test value' });
            });


            it('should not proxy `custom:event` to "customEventHandler1" when permissions is `false`', function() {
                var extraArg = { test: 'test value' };
                mediator.on('custom:event', 'customEventHandler1', spy3);
                eventProxyPermissions['custom:event']['customEventHandler1'] = false;
                emitter.trigger('custom:event', extraArg);
                sinon.assert.calledWithExactly(spy1, 'custom:event', { test: 'test value' });
                sinon.assert.calledWithExactly(spy2, 'custom:event', { test: 'test value' });
                expect(spy3.called).toBe(false);
            });
        });
    });
});
