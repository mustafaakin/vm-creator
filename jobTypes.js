module.exports = {
	"cpu1": ["sysbench", "--max-requests=500000", "--test=cpu", "run", ],
	"cpu2": ["sysbench", "--max-requests=500000", "--test=cpu", "--num-threads=2", "run"],
	"cpu3": ["sysbench", "--max-requests=500000", "--test=cpu", "--num-threads=4", "run"],
	"disk1": ["sysbench", "--max-requests=300000", "--test=fileio", "--file-test-mode=rndwr", "run", "--num-threads=32"],
	"disk2": ["sysbench", "--max-requests=200000", "--test=fileio", "--file-test-mode=rndwr", "run", "--num-threads=16"],
}