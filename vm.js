var util = require("util");
var vmtypes = require("./vmtypes");
var exec = require('child_process').exec;
var crypto = require('crypto');


function createVM(host, cpu, memory, disk, name, bridge, cb) {
	var id = crypto.randomBytes(2).toString('hex');
	var mac = [];

	// https://www.centos.org/docs/5/html/5.2/Virtualization/sect-Virtualization-Tips_and_tricks-Generating_a_new_unique_MAC_address.html
	mac = "00:16:3e:00:" + id[0] + id[1] + ":" + id[2] + id[3];

	var cmd = util.format("ssh %s 'bash /home/mustafa/buki/ubuntu1404.sh %s %s %s %s %s %s", host, cpu, memory, disk, name, bridge, mac) + "'";
	console.log(cmd);
	exec(cmd, function(err, stdout, stderr) {
		console.log("Created VM ", err);
		console.log(stdout);
		console.log(stderr);
		getIP(host, mac, function(ip) {
			cb(ip);
		});
	});
}

// createVM("server0", 1, 1024 * 1024, "20G", "mustafa", "br0");

function getIP(host, mac, cb) {
	var cmd = util.format("ssh %s 'bash /home/mustafa/buki/getip.sh %s'", host, mac);
	console.log("Getting IP");

	function find() {
		exec(cmd, function(err, stdout, stderr) {
			var t = stdout.split("\n");
			if (t.length == 2) {
				console.log("Found IP:" + t[0]);
				setTimeout(function() {
					console.log("Waited 10 seconds for sending IP");
					cb(t[0]);
				}, 10000);
			} else {
				console.log("Could not find ip, trying again");
				setTimeout(find, 3000);
			}
		});
	}

	setTimeout(find, 2000);
}

function destroyVM(host, name) {
	// Not implemented yet
}

// getIp("server0", "00:11:22:44:55:39")

function createVMWrapper(type, cb) {
	var vm = vmtypes[type];
	var name = crypto.randomBytes(5).toString('hex');

	// TODO: Select a new host
	var host = vm.host[0];
	var cpu = vm.cpu;
	var ram = vm.ram * 1024;
	var disk = vm.disk.size;
	createVM(vm.host[0], cpu, ram, disk, name, "br0", function(ip) {
		db.query("INSERT INTO vm(host,name, ip,boot,shutdown,experiment,type) VALUES(?,?,?,?,?,?)", [host, name, ip, new Date(), null, experiment, type], function(err, rows) {
			console.log(err, rows);
		});
	});
}

module.exports.createVM = createVMWrapper;
module.exports.getIP = getIP;
module.exports.destroyVM = destroyVM;


// createVM("server0", 6, 8 * 1024 * 1024, "20G", "mustafa", "br0");