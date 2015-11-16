var chalk = require('chalk');

module.exports = function(){


	this.viewer = function(){
		console.log();
		console.log(chalk.bold.bgBlack.yellow('                                      '));
		console.log(chalk.bold.bgBlack.yellow('------- MovingPostcard Viewer -------'));
		console.log(chalk.bold.bgBlack.yellow('                                      '));
		console.log();
		return this;
	}


	this.editor = function(){
		console.log();
		console.log(chalk.bold.bgYellow.black('                                      '));
		console.log(chalk.bold.bgYellow.black('------- MovingPostcard Editor  -------'));
		console.log(chalk.bold.bgYellow.black('                                      '));
		console.log();
		return this;
	}


	return this;
}