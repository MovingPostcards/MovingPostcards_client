
var program = require('commander');
var open = require('open');


var ui = require('./modules/ui.util.js')()
var serial = require('./modules/serial.util.js')()
var project = require('./modules/project.util.js')()
var web = require('./modules/web.util.js')()
var meta = require('./modules/metadata.util.js')()

/*

API:

node mp [<path>]
node mp --edit [<path>]
node mp --reset
node mp --open

*/


program
  .version('0.0.1')
  .option('-e, --edit [type]', 'Edit Project')
  .option('-r, --reset', 'Reset Project config')
  .option('-o, --open', 'Open the Browser')
  .parse(process.argv);


var path = null;
path = (program.present && program.present!==true) ? program.present : path;
path = (program.edit && program.edit!==true) ? program.edit : path;


var mode = 'viewer';
mode = (program.edit) ? 'editor' : mode;


if(mode == 'viewer'){
	ui.viewer()
}else{
	ui.editor()
}


serial.init()



project.check({path:path, mode:mode})
	.next(function(){
		checkMeta();
	})


function checkMeta(){
	if(mode == 'editor'){
		meta.checkFile();
	}
	run();
}


// need module for autorun chrome, use open mac module
// open -a "Google Chrome Canary" --args --kiosk --disable-web-security

function run(){
	web.run({mode:mode})
		.running(function(){
			if(program.open) open('http://localhost:3000/' + mode + '.html');
		})
		.connected(function(){
			serial.on(function(data){
				web.emit(data);
			})
		})
}



