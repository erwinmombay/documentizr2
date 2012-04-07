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
                mediator.proxyAllEvents(emitter);
                var spy1 = sinon.spy(emitter, 'trigger');
                var spy2 = sinon.spy(mediator, 'trigger');
                emitter.trigger('14');
                sinon.assert.calledWith(spy1, 'blah');
                expect(spy2).toHaveBeenCalled();
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
