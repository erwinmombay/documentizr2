/*global define:true, _:true*/
define(function() {
    return {
        toBeSingleton: function() {
            var actual = this.actual;
            var notText = this.isNot ? " not" : "";
            this.message = function () {
                return "Expected " + actual + notText +
                    " to be singleton object.";
            };
            return actual.prototype === undefined &&
                !_.isFunction(actual) &&
                !_.isArguments(actual) &&
                !_.isDate(actual) &&
                !_.isArray(actual) &&
                !_.isElement(actual) &&
                _.isObject(actual);
        }
    };
});
