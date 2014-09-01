/*global require*/
/*jslint node: true */

'use strict';

var JsFtp = require("jsftp");

var path = require("path");
var fs = require("fs");

var FileCache         = require("./FileCache");
var PatternCollection = require("./PatternCollection");

var patterns;
var fileCache;
var config;

var tryConnect = function () {
	if (typeof config === 'undefined' || typeof patterns === 'undefined' || typeof fileCache === 'undefined') {
		return;
	}
    
	var ftp = new JsFtp(config);
	
	ftp.on('jsftp_debug', function (eventType, data) {
		console.log('DEBUG: ', eventType);
		console.log(JSON.stringify(data, null, 2));
	});
	
	ftp.ls(".", function (err, res) {
		res.filter(function (file) {
            return patterns.contains(file.name);
        }).filter(function (file) {
            return fileCache.contains(file);
        }).forEach(function (file) {
			console.log(file);
			
			ftp.get(file.name, file.name, function (err) {
				if (err) {
                    console.log('Error getting ' + file.name);
                } else {
                    fileCache.setCached(file);
                }
			});
		});
		
		ftp.raw.quit(function (err, data) {
			if (err) {
                console.error(err);
            }
		});
		
		fs.writeFile("ftp-dl.cache.json", JSON.stringify(fileCache.serialize()), function (err) {
			if (err) {
                throw err;
            }
		});
	});
}

fs.readFile("ftp-conf.json", "ascii", function (err, data) {
	if (err) {
        throw err;
    }
    
	config = JSON.parse(data);
	console.log(config);
	
	tryConnect();
});

fs.readFile("ftp-patterns.json", "ascii", function (err, data) {
	if (err) {
        throw err;
    }
    
	patterns = PatternCollection.deserialize(data);
	console.log('Loaded ' + patterns.items().length + ' patterns');
	console.log(patterns.items);
	
	tryConnect();
});

fs.readFile("ftp-dl.cache.json", "ascii", function (err, data) {
	if (err) {
        throw err;
    }
    
	if (data) {
        fileCache = FileCache.deserialize(data);
    } else {
        fileCache = FileCache.deserialize([]);
    }
    
	console.log(fileCache.items().length + ' files in cache');
	
	tryConnect();
});