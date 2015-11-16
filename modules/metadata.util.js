var chalk = require('chalk');
var fs = require('fs');
var prompt = require('prompt');
var nconf = require('nconf');

module.exports = function(){
	
	
	var project_path;
	var metadata = {name:'Untitled Project', timeThumbs:[200,800], items:[]};

	this.checkFile = function(){

		nconf.use('file', { file: './config.json' }).load();
		project_path = nconf.get('project_path');

		if(fs.existsSync(project_path + '/metadata.json')){
			var data = fs.readFileSync(project_path + '/metadata.json');
			metadata = JSON.parse(data);
			this.createMetadata();
		}else{
			this.createMetadata();
		}

	}



	this.createMetadata = function(){

		
		var video_ext = ['mp4', 'mov', 'mkv', 'gif'];
		var index = 0;

		var arr = fs.readdirSync(project_path);

		metadata.items.forEach(function(v, i){
			
			var isPresent = false;
			arr.forEach(function(f){
				var ext = f.split('.')
				ext = ext[ext.length-1].toLowerCase();
				if(v.video_name === f && video_ext.indexOf(ext)>=0) isPresent = true;
			});
			if(!isPresent){
				metadata.items.splice(i,1);
				console.log('   Removed metadata related to: ' + v.video_name);
			}
		});

		arr.forEach(function(f){

			var ext = f.split('.')
			ext = ext[ext.length-1].toLowerCase();

			if(video_ext.indexOf(ext)>=0){

				var alreadyPresent = false;
				metadata.items.forEach(function(v){
					if(f === v.video_name) alreadyPresent=true;
				});

				var ob = {
					card_id:"",
					title: "Title "+index,
					text: "Text",
					author: "Name",
					video_name: f,
					loop:1,
					gif: (ext == 'gif') ? true : false,
					thumbs: []
				}

				for(var i=0; i<metadata.thumbs; ++i){
					ob.thumbs.push({src: 'placeholder.gif'});
				}

				if(!alreadyPresent){
					metadata.items.push(ob);
					console.log('   Added metadata for: ' + f);
				}
			}

			index++;
		});

		var res = JSON.stringify(metadata, null, "\t");
		fs.writeFileSync(project_path + '/metadata.json', res);

		if(!fs.existsSync(project_path + '/thumbs')){
			fs.mkdirSync(project_path + '/thumbs');
		}
	}


	return this;
}