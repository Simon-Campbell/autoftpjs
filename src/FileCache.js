/*jslint node: true */
/*global define*/
(function () {
    'use strict';
    
    function FileCache(cache) {
        return {
            serialize: function () {
                return JSON.stringify(cache);
            },
            
            items: function () {
                return cache;
            },
            
            isCached: function (file) {
                return cache.indexOf(file.name) !== -1;
            },
            
            setCached: function (file) {
                if (this.isCached(file)) {
                    return;
                }
                
                cache.push(file.name);
            }
        };
    }
    
    FileCache.deserialize = function (string) {
        if (!string) {
            return new FileCache([]);
        }
        return new FileCache(JSON.parse(string));
    };
    
    module.exports = FileCache;
}());