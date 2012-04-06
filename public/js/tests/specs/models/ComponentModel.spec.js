define(function(require) {
    describe('ComponentModel', function () {
        var m, c, server, ComponentModel, ComponentCollection;
        ComponentModel = require('models/ComponentModel');
        ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            m = new ComponentModel();
            c = new ComponentCollection();
        });
        
        it('should be addable to a ComponentCollection', function() {
            c.add(m);
            expect(c.length).toBe(1);
        });
        
        it('has an empty array customValidationList', function() {
            expect(m.customValidationList).toBeDefined();
            expect(m.customValidationList.length).toEqual(0);
        });

        describe('#constructor', function() {
            it('should turn any value passed in the options hash that exists in _allowedProperties as true object properties', function() {
                var m2 = new ComponentModel({ schema: 'test string' });
                expect(m2.get('schema')).toBeFalsy();
                expect(m2.schema).toEqual('test string');
            });

            it('should ignore any values passed in the options hash that exists in _ignoredAttributes', function() {
                var m2 = new ComponentModel({ schema: 'test string' });
                expect(m2.schema).toEqual('test string');
                expect(m2.get('schema')).not.toEqual('test string');
            });
        });

        describe('#destroy', function() {
            it('should destroy nested models when top level model is destroyed and option `cascade`: true is passed', function() {
                var parent = new ComponentModel({ componentCollection: c });
                var spy = sinon.spy(m, 'destroy');
                var spy2 = sinon.spy(parent, 'destroy');
                parent.componentCollection.add(m);
                parent.destroy({ cascade: true });
                expect(spy).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();
            });

            it('should not destroy nested models when top level model is destroyed and option `cascade`: false is passed', function() {
                var spy = sinon.spy(m, 'destroy');
                var parent = new ComponentModel({ componentCollection: c });
                parent.componentCollection.add(m);
                parent.destroy({ cascade: false });
                expect(spy).not.toHaveBeenCalled();
            });

            it('should not destroy nested models when top level model is destroyed and option `cascade` is not passed', function() {
                var spy = sinon.spy(m, 'destroy');
                var parent = new ComponentModel({ componentCollection: c });
                parent.componentCollection.add(m);
                parent.destroy();
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('#fetch', function() {
            beforeEach(function() {
                server = sinon.fakeServer.create();
                server.respondWith('GET', '/component', [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({ 'fullName': 'ST_0100' })
                ]);
                c.add(m);
                m.fetch();
            });

            afterEach(function() {
                server.restore();
            });

            it('should make the correct request', function() {
                expect(server.requests.length).toEqual(1);
                expect(server.requests[0].method).toEqual('GET');
                expect(server.requests[0].url).toEqual('/component');
            });

            it('should have `ST_0100` as the fullName attribute', function() {
                server.respond();
                expect(m.get('fullName')).toEqual('ST_0100');
            });

        });
    });
});
