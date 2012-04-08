define(function(require) {
    describe('AbstractComponentView', function() {
        var v, m, spy1, spy2;
        var AbstractComponentView = require('views/guicore/TreeView/AbstractComponentView');
        var ComponentModel = require('models/ComponentModel');
        var ComponentCollection = require('collections/ComponentCollection');

        beforeEach(function() {
            m = new ComponentModel({ componentCollection: new ComponentCollection() });
            v = new AbstractComponentView({ model: m });
        });

        afterEach(function() {

        });

        it('should have the private type "component"', function() {
            expect(v._type).toBe('component');
        });

        it('should create an LI element', function() {
            expect(v.el.nodeName).toBe('LI');
        });

        it('should have the class "tvc"', function() {
            expect($(v.el)).toHaveClass('tvc');
        });
    });
});
