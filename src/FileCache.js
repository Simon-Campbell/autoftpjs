/*jslint node: true */
/*global define*/
(function () {
    'use strict';
    
    function FileCache(cache) {
        var _cache = cache;
        
        return {
            serialize: function () {
                return JSON.stringify(_cache);
            },
            
            items: function () {
                return _cache;
            },
            
            isCached: function (file) {
                return _cache.indexOf(file.name) !== -1;
            },
            
            setCached: function (file) {
                if (this.isCached(file)) {      
                    return;
                }
                
                _cache.push(file.name);
            }
        };
    }
    
    FileCache.deserialize = function (string) {
        return new FileCache(JSON.parse(string));
    };
    
    module.exports = FileCache;
})();