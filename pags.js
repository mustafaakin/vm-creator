var fs = require("fs");
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
global.experiment = 3;

var vm = require("./vm");
var jobRunner = require("./job");

var jobs = fs.readFileSync("pags_jobs2").toString().split("\n");

var servers = [{
	ip: "192.168.66.244",
	respTime: 0,
	jobs: 0,	
}, {
	ip: "192.168.130.6",
	respTime: 0,
	jobs: 0,
}];


global.info = function(){
	// Just ignore for now
}

var finished = 0;

function selectServerMod(i){
	return servers[i%2];
}


function runJob(job, i) {
	var delay =  200 * (i + 1);
	

	setTimeout(function() {
		var start = new Date();
		var server = servers[0];	
	
		var url = "http://" + server.ip + ":4500";
		var obj = {
			Cmd: job.split(" "),
			name: "pags1",
		};

		jobRunner.run(url, obj, function(){
			var end = new Date();
			server.jobs++;
			server.respTime += end - start;

			error(server.ip, parseInt(server.respTime / server.jobs));
			finished++;
			if ( finished == jobs.length)
				process.exit();

		});
	}, delay);
}

for (var i = 0; i < jobs.length; i++) {
	var j = jobs[i];
	runJob(j, i);
}