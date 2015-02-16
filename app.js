var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 20,
	host: 'localhost',
	user: 'docker',
	database: 'docker',
	password: ''
});

global.db = pool;
global.experiment = 1;

var vm = require("./vm");
var job = require("./job");

vm.createVM("avg1", function(ip) {
	job.run("http://" + ip + ":4500", ["sysbench", "--test=cpu", "run"]);
});