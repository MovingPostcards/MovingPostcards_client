var nconf = require('nconf');
var chalk = require('chalk');
var fs = require('fs');

module.exports = function(){

	nconf.use('file', { file: './config.json' }).load();
	var project_path = nconf.get('project_path');

	var _next;
	

	this.check = function(conf){
		// argument provided
		if (conf.path) {
			project_path = conf.path;
		}else{
			if(!project_path){
				console.log(chalk.red("ERROR, Project Path missing or invalid argument Project Path"));
				console.log(chalk.yellow("Please run 'node mp --edit <path>' where <path> is your project folder path"));
				process.exit();
			}
		}

		if(project_path && !fs.existsSync(project_path)){
			console.log(chalk.red("ERROR, Project Path '"+project_path+"'' doesn't exist on this file system."));
			process.exit(); 
		}

		if(conf.mode == 'viewer'){
			if(!fs.existsSync(project_path + '/metadata.json')){
				console.log(chalk.red("ERROR, This is not a MovingPostcard project folder."));
				console.log(chalk.red("Please run 'node editor.js <folder_path> in order to set it up properly."));
				process.exit(); 
			}
		}


		nconf.set('project_path', project_path);
		nconf.save();

		console.log(chalk.green('Current Project: ', project_path));

		setTimeout(function(){
			_next();
		}, 500)

		return this;
	}


	this.next = function(clb){
		_next = clb;
	}

	return this;
}