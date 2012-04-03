define(function(require) {
    describe('ComponentModel', function () {
        var server, ComponentModel;

        beforeEach(function() {
            ComponentModel = require('models/ComponentModel');
            server = sinon.fakeServer.create();
        });

        it('is defined and exists in path: "models/ComponentModel"', function () {
            expect(ComponentModel).toBeDefined();
        });

        it('is a class that can be instantiated', function() {
            expect(new ComponentModel()).toBeDefined();
        });

        it('has a working constructor', function() {
            var m;
            m = new ComponentModel();
            expect(m instanceof ComponentModel).toBeTruthy();
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
