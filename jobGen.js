function random (low, high) {
    return parseInt(Math.random() * (high - low) + low);
}

for(var i = 0; i < 1000; i++){
	var threads = random(1);
	var requests = random(500, 1000);
	var arr = ["sysbench", "--max-requests=" + requests, "--test=cpu", "run", "--num-threads=" + threads];
	console.log(arr.join(" "));
}