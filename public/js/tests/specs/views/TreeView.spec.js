define(function(require) {
    'use strict';
    describe('AbstractComponentView', function() {
        var v1, m1, c1, spy1, spy2;
        var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
        var CompositeComponentView = require('views/guicore/TreeView/AbstractComponentView');
        var ComponentModel = require('models/ComponentModel');
        var ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            c1 = new ComponentCollection();
            m1 = new ComponentModel({ fullName: 'ST_0100', componentCollection: c1 });
            v1 = new AbstractComponentView({ model: m1 });
        });

        afterEach(function() {
            spy1 = null;
            spy2 = null;
        });

        it('should have the private type "component"', function() {
            expect(v1._type).toBe('component');
        });

        it('should create an LI element', function() {
            expect(v1.el.nodeName).toBe('LI');
        });

        it('should have the class "tvc"', function() {
            expect($(v1.el)).toHaveClass('tvc');
        });

        describe('Evented behaviour', function() {
            var m2, v2;

            describe('#render', function() {
                beforeEach(function() {
                    spy1 = sinon.spy(CompositeComponentView.prototype, 'render');
                    m2 = new ComponentModel();
                    v2 = new CompositeComponentView({ model: m2 });
                });

                afterEach(function() {
                    CompositeComponentView.prototype.render.restore();
                });

                it('should be triggered once on one model `change` event', function() {
                    m2.set({ fullName: 'test' });
                    sinon.assert.calledOnce(spy1);
                });
            });

            describe('#destroy', function() {
                beforeEach(function() {
                    spy1 = sinon.spy(CompositeComponentView.prototype, 'destroy');
                    m2 = new ComponentModel();
                    v2 = new CompositeComponentView({ model: m2 });
                });

                afterEach(function() {
                    CompositeComponentView.prototype.destroy.restore();
                });

                it('should be triggered once on one model `destroy` event', function() {
                    m2.destroy();
                    sinon.assert.calledOnce(spy1);
                });
            });
        });
    });
});
