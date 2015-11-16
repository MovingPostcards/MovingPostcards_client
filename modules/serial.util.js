var nconf = require('nconf');
var serialport = require("serialport");
var chalk = require('chalk');

module.exports = function(){

	var sp;

	nconf.use('file', { file: './config.json' }).load();

	var SerialPort = serialport.SerialPort;
	var serial_port = nconf.get('serial_port');
	var baud_rate = nconf.get('baud_rate'); //57600
	var read_line = nconf.get('read_line');

	var that = this;
	var _next;
	var _on;

	this.list = function(){
		serialport.list(function (err, ports) {
		    console.log();
		    console.log(chalk.green("Available ports:"));
		    ports.forEach(function(port) {
		    	console.log(chalk.gray('    ', port.comName + " " + port.manufacturer));
		    });
		});
		return this;
	}

	this.on = function(clb){
		_on = clb;
		return this;
	}

	this.next = function(clb){
		_next = clb;
		return this;
	}

	this.init = function(){

		// if set this in config.js it force its use
		var useThisPort = serial_port;

		console.log(chalk.green("Checking ports ...."));

		serialport.list(function (err, ports) {
		    console.log(chalk.green("Available ports:"));
		    ports.forEach(function(port) {
		    	console.log(chalk.gray('    ', port.comName + " " + port.manufacturer));

		    	// the first arduino port found will be used
		    	if(port.manufacturer && port.manufacturer.toLowerCase().indexOf('arduino')>=0){
		    		if(!useThisPort) useThisPort = port.comName
		    	}

		    });

		    if(useThisPort){
		    	setSerialComm(useThisPort)
		    }else{
		    	console.log(chalk.yellow('No valid serial port found. The program is running without serial connection.'));
		    }
		    
		});
			
		return this;
	}




	function setSerialComm(port){
		sp = new SerialPort(port, {
				baudrate: baud_rate,
				parser: serialport.parsers.readline(read_line)
			}
		)

		sp.on('open', function(){
		  	console.log(chalk.green('Serial Port running:', port));
			if(_next) setTimeout(function(){_next();}, 500)
		})
		
		sp.on('error', function(data){
			console.log(chalk.red(data));
			console.log(chalk.red("Check your serial port or change the value from metadata.json of config.json file"));
		})

		sp.on('data', function(data){
	  		console.log('RFID: ' + data);
	  		if(_on) _on(data)
	  	});
	}

	return this;

}
