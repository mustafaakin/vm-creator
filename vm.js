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
	info("Opening VM with cmd:", cmd);
	exec(cmd, function(err, stdout, stderr) {
		if (err) {
			err("Could not open VM..", err);
			cb(null);
		} else {
			getIP(host, mac, function(ip) {
				cb(ip);
			});
		}
	});
}

// createVM("server0", 1, 1024 * 1024, "20G", "mustafa", "br0");

function getIP(host, mac, cb) {
	var cmd = util.format("ssh %s 'bash /home/mustafa/buki/getip.sh %s'", host, mac);
	info("Finding IP of", host, mac);

	var tryCount = 0;

	function find() {
		exec(cmd, function(err, stdout, stderr) {
			var t = stdout.split("\n");
			if (t.length == 2) {
				var ip = t[0];
				info("Found IP of", host, mac, ":", ip, " waiting 10 seconds to send it");
				setTimeout(function() {
					cb(ip);
				}, 10000);
			} else {
				var tryLimit = 20;
				if (tryCount >= tryLimit) {
					error("Could not find out ip of", host, mac, "in", tryLimit, "attempts, dismissing");
					cb(null);
				} else {
					tryCount++;
					setTimeout(find, 3000);
				}
			}
		});
	}

	setTimeout(find, 2000);
}

function destroyVM(host, name, cb) {
	var cmd = util.format("ssh %s 'virsh destroy %s &&  rm -Rf /home/mustafa/buki/vms/%s'", host, name, name);
	exec(cmd, function(err, stdout, stderr) {
		console.log(err, stdout, stderr);
		info("VM", name, "on host", host, "destroyed");
		cb();
	});
}

// getIp("server0", "00:11:22:44:55:39")


function createVMWrapper(type, cb) {
	var vm = vmtypes[type];
	var name = crypto.randomBytes(5).toString('hex');

	// TODO: Select a new host intelligently..
	var host = vm.host[0];
	var cpu = vm.cpu;
	var ram = vm.ram * 1024;
	var disk = vm.disk.size;

	info("Requestded vm type", type, "on host", host);

	createVM(host, cpu, ram, disk, name, "br0", function(ip) {
		db.query("INSERT INTO vm(host,name, ip,boot, shutdown, experiment,type) VALUES(?,?,?,?,?,?,?)", [host, name, ip, new Date(), null, experiment, type], function(err, rows) {
			cb(host, name, ip);
		});
	});
}

module.exports.createVM = createVMWrapper;
module.exports.getIP = getIP;
module.exports.destroyVM = destroyVM;


// createVM("server0", 6, 8 * 1024 * 1024, "20G", "mustafa", "br0");