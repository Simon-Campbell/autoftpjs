var JsFtp = require("jsftp");

var path = require("path");
var fs = require("fs");

var patterns;
var cached;
var config;

fs.readFile("ftp-conf.json", "ascii", function (err, data) {
	if (err) throw err;
	
	config = JSON.parse(data);
	console.log(config);
	
	tryConnect();
});

fs.readFile("ftp-patterns.json", "ascii", function (err, data) {
	if (err) throw err;
	
	patterns = JSON.parse(data);
	console.log('Loaded ' + patterns.length + ' patterns');
	console.log(patterns);
	
	tryConnect();
});

fs.readFile("ftp-dl.cache.json", "ascii", function (err, data) {
	if (err) throw err;
	
	if (data) cached = JSON.parse(data);
	else cached = [];
	
	console.log(cached.length + ' files in cache');
	
	tryConnect();
});

function tryConnect() {
	if (typeof config === 'undefined'	||
		typeof patterns === 'undefined'	|| 
		typeof cached === 'undefined') {
		return;
	}
	var ftp = new JsFtp(config);	
	
	ftp.on('jsftp_debug', function(eventType, data) {
		console.log('DEBUG: ', eventType);
		console.log(JSON.stringify(data, null, 2));
	});
	
	ftp.ls(".", function (err, res) {
		res.filter(arePatternsMatching(patterns)).filter(isNotCached(cached)).forEach(function (file) {
			console.log(file);
			
			ftp.get(file.name, file.name, function (err) {
				if (err) console.log('Error getting ' + file.name);
				else cached.push(file.name);
			});
		});
		
		ftp.raw.quit(function(err, data) {
			if (err) return console.error(err);
		});
		
		fs.writeFile("ftp-dl.cache.json", JSON.stringify(cached), function (err) {
			if (err) throw err;
		});
	});
}

/**
 * Returns a function to check if a file is in the specified cache
 */
function isNotCached(cache) {
	return function (file) {
		return cache.indexOf(file.name) === -1;
	};
}

/**
 * Returns a function to check if a file matches a specified pattern
 */
function arePatternsMatching(patterns) {
	return function (file) { 
		return patterns.some(function (pattern) { 
			return new RegExp(pattern.pattern).exec(file.name);
		});
	}
}
