var request = require("request");
var Q = require("q");



function run(host, job, cb) {
	info("Running job", job.name, "on", host, "with command", job.Cmd);
	var id, code, output;
	var started = new Date();
	var ended = null;
	var ip = host.replace("http://", "").replace(":4500", "");

	createContainer(host, {
		Image: "bench",
		Cmd: job.Cmd,
	}).then(function(_id) {
		id = _id;
		var args = [ip, job.name, experiment, started, id];
		db.query("INSERT INTO runtime(ip,job,experiment,started,container) VALUES(?,?,?,?,?)", args, function(err, rows) {
			// console.log(err, rows);
		});
		return startContainer(host, id);
	}).then(function() {
		return waitContainer(host, id);
	}).then(function(_code) {
		code = _code;
		return getLogs(host, id);
	}).then(function(_output) {
		output = _output;
		ended = new Date();
		db.query("UPDATE runtime SET ended = ?, logs = ?, code  =? WHERE container = ?", [new Date(), output, code, id], function(err, rows) {
			if (err) {
				error("Could not write job to database:", err, rows);
			} else {
				info("Job", job.name, "on", host, "has finished");
			}
			cb();
		});
	})
}

module.exports.run = run;
module.exports.setExperiment = function(_experimentId) {
	experimentId = _experimentId;
}

function createContainer(host, opts) {
	var deferred = Q.defer();
	request.post({
		uri: host + "/containers/create",
		method: 'POST',
		json: opts,
	}, function(err, resp, body) {
		if (err) {
			error("Could not create a container", err, body);
		} else {
			var id = body.Id;
			deferred.resolve(id);
		}
	});
	return deferred.promise;
}

function startContainer(host, containerId, cb) {
	var deferred = Q.defer();
	request.post({
		uri: host + '/containers/' + containerId + "/start",
		method: 'POST'
	}, function(err, resp, body) {
		deferred.resolve();
	});
	return deferred.promise;
}

function waitContainer(host, containerId, cb) {
	var deferred = Q.defer();
	request.post({
		uri: host + '/containers/' + containerId + "/wait",
		method: 'POST'
	}, function(err, resp, body) {
		var code = JSON.parse(body).StatusCode;
		deferred.resolve(code);
	});
	return deferred.promise;
}

function getLogs(host, containerId, cb) {
	var deferred = Q.defer();
	var uri = host + "/containers/" + containerId + "/logs?stderr=1&stdout=1&follow=0";
	request(uri, function(err, resp, body) {
		deferred.resolve(body);
	});
	return deferred.promise;
}