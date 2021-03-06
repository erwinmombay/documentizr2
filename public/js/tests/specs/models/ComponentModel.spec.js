/*global define:true, Backbone:true, afterEach:true, sinon:true*/
define(function(require) {
    'use strict';
    describe('ComponentModel', function() {
        var m1, c, server, ComponentModel, ComponentCollection;
        ComponentModel = require('models/ComponentModel');
        ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            m1 = new ComponentModel();
            //TODO use stub or mock instead
            c = new ComponentCollection();
        });

        it('should be addable to a ComponentCollection', function() {
            expect(c.length).toBe(0);
            c.add(m1);
            expect(c.length).toBe(1);
        });

        it('has an empty array customValidationList instance property', function() {
            var m2 = new ComponentModel();
            expect(m1.customValidationList).toBeDefined();
            expect(m1.customValidationList.length).toBe(0);
            expect(m1.customValidationList).not.toBe(m2.customValidationList);
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
                m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy({ cascade: true });
                sinon.assert.calledOnce(spy1);
                sinon.assert.calledOnce(spy2);
                sinon.assert.calledOnce(spy3);
            });

            it('should not call `destroy` on nested models when top level model is destroyed and option `cascade` false is passed', function() {
                m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy({ cascade: false });
                sinon.assert.calledOnce(spy1);
                sinon.assert.notCalled(spy2);
                sinon.assert.notCalled(spy3);
            });

            it('should not call `destroy` on nested models when top level model is destroyed and option `cascade` is not passed', function() {
                m1 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m2 = new ComponentModel({ componentCollection: new ComponentCollection() });
                var m3 = new ComponentModel({ componentCollection: new ComponentCollection() });
                m1.componentCollection.add(m2);
                m2.componentCollection.add(m3);
                var spy1 = sinon.spy(m1, 'destroy');
                var spy2 = sinon.spy(m2, 'destroy');
                var spy3 = sinon.spy(m3, 'destroy');
                m1.destroy();
                sinon.assert.calledOnce(spy1);
                sinon.assert.notCalled(spy2);
                sinon.assert.notCalled(spy3);
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
                c.add(m1);
                m1.fetch();
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
                expect(m1.get('fullName')).toBe('ST_0100');
            });
        });
    });
});
