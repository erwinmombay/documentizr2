define(function(require) {
    describe('ComponentCollection', function () {
        var c, m, server, ComponentCollection;

        beforeEach(function() {
            ComponentCollection = require('collections/ComponentCollection');
            server = sinon.fakeServer.create();
            server.respondWith(
                "GET",
                "/component",
                [
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify('[{"id":123,"title":"Hollywood - Part 2"}]')
                ]
            );
            c = new ComponentCollection();
        });

        afterEach(function() {
            server.restore();
        });

        it("should add a model", function() {
            c.add({ id: 1 });
            expect(c.length).toEqual(1);
        });
    

        it('is defined and exists in path: "collections/ComponentCollection"', function() {
            expect(ComponentCollection).toBeDefined();
        });

        it('instances have the url "/component"', function() {
            expect(c.url).toBe('/component');
        });

        it('should make the correct GET request', function() {
            c.fetch();
            expect(server.requests.length).toEqual(1);
            expect(server.requests[0].method).toEqual('GET');
            expect(server.requests[0].url).toEqual('/component');
        });

        it('should get models from the response', function() {
            var spy = sinon.spy();
            c.fetch({
                success: function(a, b) {
                    console.log('succ');
                    console.log(a);
                    console.log(b);
                },
                error: function(a, b) {
                    console.log('err');
                    console.log(a);
                    console.log(b);
                }
            });
            server.respond();
            expect(c.length).toEqual(1);
        });

    });
});
