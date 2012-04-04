define(function(require) {
    describe('ComponentModel', function () {
        var server, ComponentModel;

        beforeEach(function() {
            ComponentModel = require('models/ComponentModel');
            server = sinon.fakeServer.create();
            server.respondWith('GET', '/component',
                [200, {'Content-Type': 'application/json'}, JSON.stringify('reso')]
            );
        });

        afterEach(function() {
            server.restore();
        });

        it('should make the correct request', function() {
            var m = new ComponentModel();
            m.url = '/component';
            m.fetch();
            server.respond();
        });

        it('is defined and exists in path: "models/ComponentModel"', function () {
            expect(ComponentModel).toBeDefined();
        });

        it('has the url "/component" inherited from ComponentCollection', function() {
            var ComponentCollection = require('collections/ComponentCollection');
            var collection = new ComponentCollection().add(new ComponentModel());
            expect(collection.at(0).url()).toBe('/component');
        });

        it('has an empty array customValidationList', function() {
            expect(new ComponentModel().customValidationList).toBeDefined();
            expect(new ComponentModel().customValidationList.length).toEqual(0);
        });
    });
});
