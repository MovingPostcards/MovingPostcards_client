var app = angular.module('movingPostcard', ['dm.style'])
    

 app.controller('mainCtrl', function main($scope, $rootScope, $timeout, $interval, $http) {
    
    var socket = io.connect('http://localhost:3000');

    socket.on('connect', function(data){
        $rootScope.$evalAsync(function(){
            console.info('connect', data);

            socket.on('data', function(data){
                $rootScope.$evalAsync(function(){
                    console.info('data', data);
                    angular.forEach($scope.items, function(item){
                        if(+item.card_id == data){
                            $scope.toggleFromId(item);
                        }
                    })
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

    
    
    

    $scope.isPresent = false;
    $scope.project;
     
    $http.get('/metadata.json')
        .success(function(data){
            console.log(data);
            $scope.project = data;
            $scope.items = data.items;
            init();
        })
        .error(function(data){
            console.log(data); 
        })
    

    var scale = 1;

    function init() {

        var l = $scope.items.length;
        var cols = Math.ceil(Math.sqrt(l));
        var rows = Math.ceil(Math.sqrt(l));
        $scope.perc = 100 / cols + "%";
        console.log(cols, rows, $scope.perc);

        $rootScope.$evalAsync(function () {
            angular.element('.item').each(function (item, index) {
                console.log(item, index);
            })
        });

        scale = cols * .85;
        
        angular.forEach($scope.items, function(d, i){

            d.index = i;
            d.id = i + '_' + d.card_id;

            if(d.thumbs.length>0){
                d.step = 0;
                var t = Math.random()*$scope.project.timeThumbs[1] + $scope.project.timeThumbs[0];
                $interval(function(){
                    
                    var pstep = d.step-1;
                    if(d.step == 0){
                        pstep = d.thumbs.length-1;
                    }
                    
                    d.thumbs[pstep].visible = false;
                    d.thumbs[d.step].visible = true;
                    
                    d.step++;
                    if(d.step>=d.thumbs.length) d.step = 0;
                }, t);
            }

        });

    }

    var currentEl;
    var currentOb;

    $scope.toggle = function (item, e) {
        if (item.open) {
            $scope.collapse(item, $(e.currentTarget));
        } else {
            $scope.expand(item, $(e.currentTarget));
        }

    }

    $scope.toggleFromId = function (item) {
        var el = angular.element('#item_' + item.id);
        if (item.open) {
            $scope.collapse(item, el);
        } else {
            $scope.expand(item, el);
        }

    }

    $scope.getClass = function (item) {
        return (item.open) ? 'presented' : '';
    }

    var currentVideo;

    $scope.expand = function (item, el) {
        console.log('expand');
        
        if (currentEl) {
            $scope.collapse(currentOb, currentEl);
        }

        $rootScope.$evalAsync(function () {
            var w = $(window).width();
            var h = $(window).height();
            var iw = el.width();
            var ih = el.height();
            var pos = el.position();
            var ix = ((w - iw) / 2 - pos.left) / scale;
            var iy = ((h - ih) / 2 - pos.top) / scale;

            el.transition({
                scale: [scale, scale],
                x: ix,
                y: iy
            }, 1000);
        });

        currentEl = el;
        currentOb = item;
        item.open = true;
        item.current_loop = 1;
        
        $scope.isPresent = true;
        $scope.projectName = item.title;
        $scope.authorName = item.author;

        

        if(item.gif){
            $timeout(function(){
                currentVideo = document.getElementById('video_'+item.id);
                $scope.toggleFromId(item);
            }, 250 + item.loop*1000)
        }else{
            $timeout(function(){
                currentVideo = document.getElementById('video_'+item.id);
                currentVideo.onended = function(e) {
                    if(item.current_loop >= item.loop){
                        $scope.toggleFromId(item);
                        item.current_loop = 1;
                    }else{
                        item.current_loop++;
                        currentVideo.play();
                    }
                };
            }, 250)
        }

        
    }

    $scope.collapse = function (item, el) {
        console.log('collapse', el);
        
        $scope.isPresent = false;
        
        currentEl = null;
        currentOb = null;
        
        el.transition({
            scale: [1.0, 1.0],
            x: 0,
            y: 0
        }, function () {
            $rootScope.$evalAsync(function () {
                item.open = false;
            });
        })

        if(currentVideo.onended) currentVideo.onended = null;
        currentVideo = null;
    }

    

});