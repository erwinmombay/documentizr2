define(function(require) {
    describe('ComponentCollection', function () {
        var server, ComponentCollection;

        beforeEach(function() {
            ComponentCollection = require('collections/ComponentCollection');
            server = sinon.fakeServer.create();
        });

        it('is defined and exists in path: "collections/ComponentCollection"', function() {
            expect(ComponentCollection).toBeDefined();
        });

        it('instances has the url "/component"', function() {
            expect(new ComponentCollection().url).toBe('/component');
        });
    });
});
