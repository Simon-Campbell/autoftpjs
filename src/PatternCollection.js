/*jslint node: true */
/*global define*/
(function () {
    'use strict';
    
    function PatternCollection(patterns) {
        var _patterns = patterns;
        
        return {
            items: function () {
                return _patterns;
            },
            
            contains: function (string) {
                return _patterns.some(function (pattern) {
                    return new RegExp(pattern.pattern).exec(string);
                });
            },
            
            serialize: function () {
                return JSON.stringify(_patterns);
            }
        };
    }
    
    PatternCollection.deserialize = function (contents) {
        return new PatternCollection(JSON.parse(contents));
    };
    
    module.exports = PatternCollection;
})();