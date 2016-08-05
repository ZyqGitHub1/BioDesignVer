var editPro = angular.module('edit-app', ['ngMaterial','ng-sortable']);

editPro.controller('designController', function($scope, $mdSidenav, $mdMedia, $http, $mdDialog, $mdToast) {
	$scope.search_info = [];//搜索结果
	$scope.chain_info = [];//用户编辑的基因链
    $scope.chain_new = $scope.chain_info.concat();
    $scope.left_arrow_show = false;//基因左侧箭头显示标志
    $scope.right_arrow_show = false;//基因右侧箭头显示标志
    $scope.float_right = false;
    $scope.float_left = true;

    //拖动配置(user)
	$scope.putConfig = {
		group: {
			name:'gene',
            pull:false,
            put:true,
		},
		animation: 150,
		onUpdate: function(evt) {
            console.log('update:');
            console.log(evt);
			var login_token = JSON.parse(sessionStorage.getItem('login'));
			var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));

            for (var i = 0;i < $scope.chain_info.length;i++) {
                if ((Math.floor(i / 5) + 1) % 2 == 0) {
                    $scope.chain_info[i].left_arrow_show = false;
                    $scope.chain_info[i].right_arrow_show = true;
                } else {
                    $scope.chain_info[i].right_arrow_show = false;
                    $scope.chain_info[i].left_arrow_show = true;
                }

                if ((i + 1) % 5 == 0) {
                    $scope.chain_info[i].down_arrow_show = false;
                } else {
                    $scope.chain_info[i].down_arrow_show = true;
                }
            }

			$scope.chain_new.push({
				img: evt.model.img,
				name: evt.model.name,
				id: evt.model.id,
			});

			var opt = {
				url: '/design/updateChain',
				method: 'POST',
				data: {
					token: login_token,
					chain_id: 20,
					chain_info: $scope.chain_new,
				},
				headers: { 'Content-Type': 'application/json'}
			};

			$http(opt).success(function(data) {
    			if (data.successful) {
    				showToast($mdToast,"save SUCCESS!");
    			}
    		});
		},
        onAdd: function(evt) {
            console.log($scope.chain_info);
            var login_token = JSON.parse(sessionStorage.getItem('login'));
            var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));

            for (var i = 0;i < $scope.chain_info.length;i++) {
                if ((Math.floor(i / 5) + 1) % 2 == 0) {
                    $scope.chain_info[i].left_arrow_show = false;
                    $scope.chain_info[i].right_arrow_show = true;
                    $scope.chain_info[i].float_right = true;
                    $scope.chain_info[i].float_left = false;
                } else {
                    $scope.chain_info[i].right_arrow_show = false;
                    $scope.chain_info[i].left_arrow_show = true;
                    $scope.chain_info[i].float_right = false;
                    $scope.chain_info[i].float_left = true;
                }

                if ((i + 1) % 5 == 0) {
                    $scope.chain_info[i].down_arrow_show = false;
                }
            }

            $scope.chain_new.push({
                img: evt.model.img,
                name: evt.model.name,
                id: evt.model.id,
                right_arrow_show: evt.model.right_arrow_show,
                left_arrow_show: evt.model.left_arrow_show,
            });


            var opt = {
                url: '/design/updateChain',
                method: 'POST',
                data: {
                    token: login_token,
                    chain_id: 20,
                    chain_info: $scope.chain_new,
                },
                headers: { 'Content-Type': 'application/json'}
            };

            $http(opt).success(function(data) {
                if (data.successful) {
                    showToast($mdToast,"save SUCCESS!");
                }
            });
        },
        onRemove: function(evt) {
            console.log(evt);
            var login_token = JSON.parse(sessionStorage.getItem('login'));
            var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));
            $scope.chain_new.push({
                img: evt.model.img,
                name: evt.model.name,
                id: evt.model.id,
            });

            var opt = {
                url: '/design/updateChain',
                method: 'POST',
                data: {
                    token: login_token,
                    chain_id: 20,
                    chain_info: $scope.chain_new,
                },
                headers: { 'Content-Type': 'application/json'}
            };

            $http(opt).success(function(data) {
                if (data.successful) {
                    showToast($mdToast,"save SUCCESS!");
                }
            });
        },
	};

    //拖动配置(side)
	$scope.pullConfig = {
		group: {
			name:'gene',
            pull:'clone',
            put:false,
		},
        sort:false,
		animation: 150,
        onRemove: function (evt) {
            console.log(evt);
            console.log(evt.newIndex);
        },
        handle:'.handle'
	};

	//页面初始化
	$scope.init = function(){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var chain_id = JSON.parse(sessionStorage.getItem('chain_id'));
		var opt = {
			url: '/home/getChain',
			method: 'POST',
			data: {
				token: login_token,
				chain_id: chain_id
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data) {
			if (data.successful) {
				$scope.chain_result = data.data;
				for (var i = 0;i < chain_result.length;i++) {
					$scope.chain_info.push({
						img: '../img/' + chain_result[i].part_type + '.png',
						name: chain_result[i].part_name,
                        left_arrow_show: true,
                        right_arrow_show: true,
					});

                    if ((Math.floor(i / 5) + 1) % 2 == 0) {
                        $scope.chain_info[i].left_arrow_show = false;
                        $scope.chain_info[i].right_arrow_show = true;
                        $scope.chain_info[i].float_right = true;
                        $scope.chain_info[i].float_left = false;
                    } else {
                        $scope.chain_info[i].right_arrow_show = false;
                        $scope.chain_info[i].left_arrow_show = true;
                        $scope.chain_info[i].float_right = false;
                        $scope.chain_info[i].float_left = true;
                    }

                    if ((i + 1) % 5 == 0) {
                        $scope.chain_info[i].down_arrow_show = false;
                    }
				}
			}
		});
	}

	//获得搜索结果
	$scope.getSearchResult = function(key_word){
		var login_token = JSON.parse(sessionStorage.getItem('login'));
		var opt = {
			url: '/design/searchParts',
			method: 'POST',
			data: {
				token: login_token,
				keyword: key_word
			},
			headers: { 'Content-Type': 'application/json'}
		};
		$http(opt).success(function(data){
			if(data.successful){
				var search_result = data.data;
                $scope.search_info = [];
				for (var i = 0;i < search_result.length;i++) {
					$scope.search_info.push({
						img: '../img/' + search_result[i].part_type + '.png',
						name: search_result[i].part_name,
						id: search_result[i].part_id,
                        left_arrow_show: true,
                        right_arrow_show: true,
                        down_arrow_show: true,
					});
				}
			}
		});
	}
	
	$scope.search_by_keyboard = function($event,key_word){
		console.log('aaa');
      	if($event.keyCode == 13) {//回车
          	getSearchResult(key_word);
      	}
  	};

	//侧边栏方法
  	$scope.openLeftMenu = function() {
    	$mdSidenav('left').toggle();
  	};

  	$scope.init();

  	//添加功能标签按钮事件方法
  	$scope.showAddFunctionTagsDialog = function(ev){
  		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
  		$mdDialog.show({
  			controller:AddFunctionTagsCtrl,
  			templateUrl:'html/new_function_tags.tmp.html',
  			parent:angular.element(document.body),
  			targetEvent:ev,
  			clickOutsideToClose:true,
  			fullscreen:useFullScreen,
  			locals:{$http:$http, $mdToast:$mdToast}
  		}).then(function(answer){
  		}, function(){
  		});
  		$scope.$watch(function(){
  			return $mdMedia('xs') || $mdMedia('sm');
  		}, function(wantsFullScreen){
  			$scope.customFullscreen = (wantsFullScreen === true);
  		});
  	}
});

function AddFunctionTagsCtrl($scope, $mdDialog) {

  	$scope.hide = function() {
	    $mdDialog.hide();
  	};

  	$scope.cancel = function() {
	    $mdDialog.cancel();
  	};

  	$scope.add_function_tags = function(){

  	};
}

var last = {
	bottom: false,
	top: true,
	left: false,
	right: true
};

var toastPosition = angular.extend({},last);

function sanitizePosition(){
	var current = toastPosition;
	if (current.bottom && last.top) current.top = false;
	if (current.top && last.bottom) current.bottom = false;
	if (current.right && last.left) current.left = false;
	if (current.left && last.right) current.right = false;
	last = angular.extend({},current);
}

var getToastPosition = function(){
	sanitizePosition();
	return Object.keys(toastPosition)
		.filter(function(pos) { return toastPosition[pos]; })
		.join(' ');
}

function showToast($mdToast, msg){
	var pinTo = getToastPosition();
	var toast = $mdToast.simple()
		.textContent(msg)
		.highlightAction(true)
		.position(pinTo);
	$mdToast.show(toast).then(function(response){
		if(response == 'ok'){
		}
	});
}