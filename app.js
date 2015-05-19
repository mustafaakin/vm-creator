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
global.experiment = 2;

var vm = require("./vm");
var job = require("./job");


var jobs = [];

for (var key in jobTypes) {
	jobs.push(key);
}

var vmTypes2 = [];
for (var key in vmTypes) {
	vmTypes2.push(key);
}

var combinations = [];

var total = 1 << jobs.length;
var len = jobs.length;
for (var i = 1; i < total; i++) {
	var a = [];
	for (var j = 0; j < len; j++) {
		var bit = ((i & (1 << j)) >> j);
		if (bit == 1) {
			a.push(jobs[j]);
		}
	}
	combinations.push(a);
}

function runCombination(combination, cb) {
	async.eachSeries(vmTypes2, function(type, cb) {
		vm.createVM(type, function(host, name, ip) {
			async.each(combination, function(jobName, cb2) {
				var url = "http://" + ip + ":4500";
				var obj = {
					Cmd: jobTypes[jobName],
					name: jobName,
				}
				console.log(obj);
				job.run(url, obj, cb2);
			}, function(err) {
				cb();
				vm.destroyVM(host, name, function() {});
			});
		});
	}, function() {
		console.log("completed");
		cb();
	});
}

combinations = [
	["disk2", "disk1"],
	["disk2", "disk1", "cpu1", "cpu2"],
	["disk2", "disk1", "cpu1", "cpu2", "cpu3"]
];


async.eachSeries(combinations, function(combination, cb) {
	// console.log("Hey", combination);
	runCombination(combination, cb);
}, function() {
	console.log("All Completed");
})