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



vm.createVM("avg1", function(host, name, ip) {
	job.run("http://" + ip + ":4500", {
		Cmd: ["sysbench", "--test=cpu", "run"],
		name: "job1",
	}, function() {
		vm.destroy(host, name, function() {

		});
	});
});