var vmTypes = require("./vmTypes");
var jobTypes = require("./jobTypes");

global.colors = require("colors");
var async = require("async");

function d() {
	return (new Date()).toLocaleTimeString();
}

global.info = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	console.log(d().blue, args.join(" "));
}

global.error = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	console.error(d().red, args.join(" "));
}

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 20,
	host: 'localhost',
	user: 'jobs',
	database: 'jobs',
	password: ''
});

global.db = pool;
global.experiment = 1;

var vm = require("./vm");
var job = require("./job");


var jobs = [];

for (var key in jobTypes) {
	jobs.push(key);
}

var combinations = [];

var total = 1 << jobs.length;
var len = jobs.length;
for (var i = 1; i < total; i++) {
	// console.log(i);
	var a = [];
	for (var j = 0; j < len; j++) {
		var bit = ((i & (1 << j)) >> j);
		if (bit == 1) {
			a.push(jobs[j]);
		}
	}
	combinations.push(a);
}

async.eachSeries(combinations, function(combination, cb) {
	console.log("Hey", combination);
	cb(null);
}, function() {
	console.log("All Completed");
})