define(function(require) {
    describe('ComponentCollection', function() {
        var c, m, server, ComponentCollection;
        ComponentCollection = require('collections/ComponentCollection');
        beforeEach(function() {
            c = new ComponentCollection();
        });

        it("#add => should add a model", function() {
            c.add({ id: 1 });
            expect(c.length).toEqual(1);
        });

        describe('#fetch', function() {
            beforeEach(function() {
                server = sinon.fakeServer.create();
                c.url = '/component';
                server.respondWith('GET', '/component', [
                    200,
                    { "Content-Type": "application/json" },
                    '{ "OK" : "True "}'
                ]);
            });

            afterEach(function() {
                server.restore();
            });

            it('should make the correct GET request', function() {
                c.fetch();
                expect(server.requests.length).toEqual(1);
                expect(server.requests[0].method).toEqual('GET');
                expect(server.requests[0].url).toEqual('/component');
            });

            it('should get models from the response', function() {
                var spy = sinon.spy();
                var spy2 = sinon.spy();
                c.fetch({ success: spy, error: spy2 });
                server.respond();
                expect(spy.called).toBeTruthy();
                expect(spy2.called).toBeFalsy();
                expect(c.length).toEqual(1);
            });

        });

    });
});
