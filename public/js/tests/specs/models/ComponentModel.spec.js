define(function(require) {
    'use strict';
    describe('ComponentModel', function() {
        var m, c, server, ComponentModel, ComponentCollection;
        ComponentModel = require('models/ComponentModel');
        ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            m = new ComponentModel();
            c = new ComponentCollection();
        });
        
        it('should be addable to a ComponentCollection', function() {
            expect(c.length).toBe(0);
            c.add(m);
            expect(c.length).toBe(1);
        });
        
        it('has an empty array customValidationList', function() {
            expect(m.customValidationList).toBeDefined();
            expect(m.customValidationList.length).toBe(0);
        });

        describe('#constructor', function() {
            it('should turn any value passed in the options hash that exists in _allowedProperties as true object properties', function() {
                var m2 = new ComponentModel({ schema: 'test string' });
                expect(m2.has('schema')).toBe(false);
                expect(m2.schema).toBe('test string');
            });

            it('should ignore any values passed in the options hash that exists in _ignoredAttributes', function() {
                var m2 = new ComponentModel({ schema: 'test string' });
                expect(m2.schema).toBe('test string');
                expect(m2.get('schema')).not.toBe('test string');
            });
        });

        describe('#destroy', function() {
            it('should call `destroy` on nested models when top level model is destroyed and option `cascade` true is passed', function() {
                var m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy({ cascade: true });
                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();
                expect(spy3).toHaveBeenCalled();
            });

            it('should not call `destroy` on nested models when top level model is destroyed and option `cascade` false is passed', function() {
                var m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy({ cascade: false });
                expect(spy1).toHaveBeenCalled();
                expect(spy2).not.toHaveBeenCalled();
                expect(spy3).not.toHaveBeenCalled();
            });

            it('should not call `destroy` on nested models when top level model is destroyed and option `cascade` is not passed', function() {
                var m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy();
                expect(spy1).toHaveBeenCalled();
                expect(spy2).not.toHaveBeenCalled();
                expect(spy3).not.toHaveBeenCalled();
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
                expect(server.requests.length).toBe(1);
                expect(server.requests[0].method).toBe('GET');
                expect(server.requests[0].url).toBe('/component');
            });

            it('should have "ST_0100" as the `fullName` attribute', function() {
                server.respond();
                expect(m.get('fullName')).toBe('ST_0100');
            });
        });
    });
});
