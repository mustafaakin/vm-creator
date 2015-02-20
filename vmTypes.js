module.exports = {
	"avg1": {
		host: ["server0", "server1"],
		cpu: 1,
		ram: 512,
		disk: {
			size: "20G",
			type: "HDD",
		},
		price: 0.5,		
	},
	"avg2": {
		host: ["server0", "server1"],
		cpu: 2,
		ram: 1024,
		disk: {
			size: "30G",
			type: "HDD",
		},
		price: 1,
	},
	"avg3": {
		host: ["server0", "server1"],
		cpu: 4,
		ram: 2048,
		disk: {
			size: "40G",
			type: "HDD",
		},
		price: 2,
	},
	"cpu1": {
		host: ["server0", "server1"],
		cpu: 2,
		ram: 512,
		disk: {
			size: "30G",
			type: "HDD",
		},
		price: 0.75,
	},	
	"cpu2": {
		host: ["server0", "server1"],
		cpu: 4,
		ram: 1024,
		disk: {
			size: "40G",
			type: "HDD",
		},
		price: 1.5,
	},		
	"cpu3": {
		host: ["server0", "server1"],
		cpu: 8,
		ram: 2048,
		disk: {
			size: "50G",
			type: "HDD",
		},
		price: 3,
	},		
	"ram1": {
		host: ["server0", "server1"],
		cpu: 2,
		ram: 2048,
		disk: {
			size: "20G",
			type: "HDD",
		},
		price: 0.75,
	},		
	"ram2": {
		host: ["server0", "server1"],
		cpu: 4,
		ram: 4096,
		disk: {
			size: "30G",
			type: "HDD",
		},
		price: 1.5,
	},
	"ram3": {
		host: ["server0", "server1"],
		cpu: 4,
		ram: 8192,
		disk: {
			size: "30G",
			type: "HDD",
		},
		price: 1.5,		
	},
	"disk1": {
		host: ["server2"],
		cpu: 1,
		ram: 512,
		disk: {
			size: "40G",
			type: "SSD",
		},
		price: 1,		
	},
	"disk2": {
		host: ["server2"],
		cpu: 2,
		ram: 1024,
		disk: {
			size: "30G",
			type: "HDD",
		},
		price: 2,
	},
}