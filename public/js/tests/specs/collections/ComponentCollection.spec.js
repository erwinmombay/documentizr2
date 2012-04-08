define(function(require) {
    'use strict';
    describe('ComponentCollection', function() {
        var c, server, ComponentModel, ComponentCollection;
        ComponentModel = require('models/ComponentModel');
        ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            c = new ComponentCollection();
        });

        describe('#add', function() {
            it('should add an object literal', function() {
                c.add({ id: 1 });
                expect(c.length).toBe(1);
            });

            it('should add `ComponentModel`', function() {
               var m = new ComponentModel();
               c.add(m);
               expect(c.length).toBe(1);
            });
        });

        describe('#fetch', function() {
            beforeEach(function() {
                server = sinon.fakeServer.create();
                server.respondWith('GET', '/component', [
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify({ 'OK' : 'True' })
                ]);
            });

            afterEach(function() {
                server.restore();
            });

            it('should make the correct GET request', function() {
                c.fetch();
                expect(server.requests.length).toBe(1);
                expect(server.requests[0].method).toBe('GET');
                expect(server.requests[0].url).toBe('/component');
            });

            it('should get models from the response', function() {
                var spy = sinon.spy();
                c.fetch({ success: spy });
                server.respond();
                expect(spy.called).toBe(true);
                expect(c.length).toBe(1);
            });
        });
    });
});
