/*jslint node: true */
/*global define*/
(function () {
    'use strict';
    
    function PatternCollection(patterns) {
        return {
            items: function () {
                return patterns;
            },
            
            contains: function (string) {
                return patterns.some(function (pattern) {
                    return new RegExp(pattern.pattern).exec(string);
                });
            },
            
            serialize: function () {
                return JSON.stringify(patterns);
            }
        };
    }
    
    PatternCollection.deserialize = function (string) {
        if (!string) {
            return new PatternCollection([]);
        }
        
        return new PatternCollection(JSON.parse(string));
    };
    
    module.exports = PatternCollection;
}());