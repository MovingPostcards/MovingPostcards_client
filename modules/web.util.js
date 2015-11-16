var http = require('http');
var express = require('express');
var chalk = require('chalk');
var nconf = require('nconf');
var sys = require('sys');
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');
var multer  = require('multer')
var busboy = require('connect-busboy');
var connect = require('connect');

module.exports = function(){

	
	var project_path
	var _connected;
	var _running;
	var _socket;

	this.run = function(conf){

		nconf.use('file', { file: './config.json' }).load();
		project_path = nconf.get('project_path');

		var app = express();
		var server = http.createServer(app).listen(3000);
		var io = require('socket.io').listen(server);

		app.use(express.static(process.env.PWD + '/' + conf.mode));
		app.use(express.static(project_path));

		if(conf.mode == 'editor'){
			app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
			app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
			  extended: true
			}));

			//app.use(multer({ dest: './uploads/'}))


			// https://github.com/bebraw/canvas-dataview-upload
			app.use(busboy({immediate: true}));

			app.post('/save_thumb', function(req, res){ 
				console.log('save_thumb');
				req.busboy.on('file', function(fieldname, file) {
		            var p = path.join(project_path, fieldname);
		            file.pipe(fs.createWriteStream(p));
		            console.log('saved file to', p);
		            res.sendStatus(200);
		        });
	        });

			process.on('exit', terminator);

		    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
		    'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
		    ].forEach(function(element) {
		        process.on(element, function() { terminator(element); });
		    });


			app.post('/save', function(req, res){    
			    var path = req.body;
			    var json = JSON.stringify(req.body, null, "\t");
				fs.writeFile(project_path + '/metadata.json', json, function(err) {
					if (err) throw err
		            console.log('metadata saved');
		        	res.send(json);
				});

			});
		}

		console.log(chalk.green.bold("WebServer running at: http://localhost:3000"));

		setTimeout(function(){
			if(_running) _running();
		}, 100);

		io.sockets.on('connection', function (socket) {
		  	console.log(chalk.bold.green('client connected'));
		  	_socket = socket;
			if(_connected) _connected()
		});
		
		return this;
	}

	function terminator(sig) {
	    if(typeof sig === 'string') {
	        console.log('%s: Received %s - terminating Node server ...',
	            Date(Date.now()), sig);

	        process.exit(1);
	    }

	    console.log('%s: Node server stopped.', Date(Date.now()) );
	}



	this.running = function(clb){
		_running = clb;
		return this;
	}

	this.connected = function(clb){
		_connected = clb;
		return this;
	}

	this.emit = function(data){
		_socket.emit('data', data);
		return this;
	}

	return this;

}
