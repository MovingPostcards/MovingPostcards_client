angular.module('movingPostcard', [])
	.controller('mainCtrl', function($scope, $http, $timeout, $rootScope){
		console.log('mainCtrl');

		$http.get('/metadata.json')
            .success(function(data){
            	$scope.project = data;
                $scope.items = data.items;
            })
            .error(function(data){
                 console.log(data);
           });


        
        $scope.captureAndSave = function(item, index) {
        	$rootScope.$evalAsync(function(){

        		if(!item.step) item.step=0;

        		var video = document.getElementById("video_"+index);
	            var canvasDraw = document.getElementById('buffer');
	            var w = canvasDraw.width;
	            var h = canvasDraw.height;
	            var ctxDraw = canvasDraw.getContext('2d');
	            ctxDraw.clearRect(0, 0, w, h);
	            ctxDraw.drawImage(video, 0, 0, w, h);
	            ctxDraw.save();

	            var name = $(video).attr('id') + '__' + item.step + '.png';
	            var content = canvasDraw.toDataURL();

	            var ob = {path: 'thumbs/'+name, data:content}

	            item.step++;

	            var xhr = new XMLHttpRequest();
	            var formData = new FormData();
	            var blob = dataURItoBlob(content);
	            formData.append('thumbs/'+name, blob);
	            xhr.open('POST', '/save_thumb', true);

	            
	            xhr.onload = function(e) {
	            	$rootScope.$evalAsync(function(){
		                console.log('success', 'thumbs/'+name);
		                item.thumbs.push({src:'thumbs/'+name});
		                $scope.prepareToSave();
	                })
	            };
	            

	            xhr.send(formData);
	            /*$http.post('/save_thumb', ob)
	            	.success(function(data){
	            		console.log(data);
	            	})
	            	.error(function(data){
	            		console.log(data);
	            	})*/

            })
        }

        var timer;
        $scope.prepareToSave = function(){
        	$timeout.cancel(timer);
        	timer = $timeout(function(){
        		$scope.saveProject();
        	}, 500);
        }

        $scope.saveProject = function(){
        	console.log('metadata do save...');
        	$scope.checkProjectData();
        	$http.post('/save', $scope.project)
                .success(function(data){
                     console.log(data);
                })
                .error(function(data){
                     console.log(data);
               });
        }


        $scope.checkProjectData = function(){
        	var p = $scope.project;
        	angular.forEach(p.items, function(item){
        		item.loop = (item.loop<1) ? 1 : item.loop;
        	})
        }


        $scope.currentForListening;
		$scope.labelPairing = 'Pair with incoming CARD ID';
        $scope.setForListening = function(item){
        	if($scope.currentForListening == item){
        		$scope.currentForListening = null;
        		$scope.labelPairing = 'Pair with incoming CARD ID';
        	}else{
        		$scope.currentForListening = item;
        		$scope.labelPairing = 'Waiting for a Card...';
        	}
        }

        $scope.getClassListening = function(item){
        	return ($scope.currentForListening == item) ? 'listening' : '';
        }



        function dataURItoBlob(dataURI) {
	        // convert base64 to raw binary data held in a string
	        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	        var byteString = atob(dataURI.split(',')[1]);
	        // separate out the mime component
	        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	        // write the bytes of the string to an ArrayBuffer
	        var ab = new ArrayBuffer(byteString.length);
	        var dw = new DataView(ab);
	        for(var i = 0; i < byteString.length; i++) {
	            dw.setUint8(i, byteString.charCodeAt(i));
	        }
	        // write the ArrayBuffer to a blob, and you're done
	        return new Blob([ab], {type: mimeString});
	    }




	    $scope.removeThumb = function(item, img){
	    	var index = item.thumbs.indexOf(img);
	    	item.thumbs.splice(index,1);
	    	$scope.prepareToSave();
	    }


	    $scope.getTypeLabel = function(item){
	    	return (item.gif) ? 'Gif' : 'Video';
	    }


        var socket = io.connect('http://localhost:3000');

	    socket.on('connect', function(data){
	        $rootScope.$evalAsync(function(){
	            console.info('connect', data);

	            socket.on('data', function(data){
	                $rootScope.$evalAsync(function(){
	                    console.info('data', data);
	                    if($scope.currentForListening){
	                    	var cleanval = data.split('\r');
	                    	$scope.currentForListening.card_id = cleanval[0];
	                    	$scope.currentForListening = null;
	                    	$scope.prepareToSave();
	                    }
	                    
	                })
	            });
	        })
	    });

	    socket.on('disconnect', function(data){
	        console.info('disconnect', data);
	    });

	    socket.on('error', function(data){
	        console.info('error', data);
	    });
	})