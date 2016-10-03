(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('devModalRequirementsNewAppController', ['$scope','$location','$http','$parse', '$window','dataFactory','$uibModal','$rootScope','$timeout',
    			function($scope,$location,$http,$parse,$window,dataFactory,$uibModal,$rootScope,$timeout){

		
		
    	/*-------------------------------------------------------MODALS-----------------------------------------------------*/
		$scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		};

		$scope.close = function(){
			$rootScope.modalInstance.dismiss('cancel');
		}

		$scope.readInit = function(){
			if (!$rootScope.addFeature) {
				$scope.modalTitle = $rootScope.requirements[$rootScope.indexFeature].title;
				$scope.modalDescription = $rootScope.requirements[$rootScope.indexFeature].description;
				$scope.modalFormat = $rootScope.requirements[$rootScope.indexFeature].format;
				$scope.modalduration = $rootScope.requirements[$rootScope.indexFeature].duration;
				$scope.modalmaxLength = $rootScope.requirements[$rootScope.indexFeature].maxLength;
				$scope.modalWidth = $rootScope.requirements[$rootScope.indexFeature].width;
				$scope.modalHeight = $rootScope.requirements[$rootScope.indexFeature].height;
				$scope.modalSize = $rootScope.requirements[$rootScope.indexFeature].size;
				$scope.modalFileSize = $rootScope.requirements[$rootScope.indexFeature].fileSize;
			} else {
				$scope.modalSize = "Máximo"
				$scope.modalFormat = "Imagen formato psd"
			}
		};

		$scope.savefastPlan = function(index,modalTitle,modalDescription,modalFormat,modalduration,modalmaxLength,modalWidth,modalHeight,modalSize,modalFileSize){
			$rootScope.modalInstance.dismiss('cancel');
			if ($rootScope.addFeature) {
				$rootScope.requirements.push({	'title'			:modalTitle,
							            		'description'	:modalDescription,
							            		'format'		:modalFormat,
							            		'duration'		:modalduration,
							            		'maxLength'		:modalmaxLength,
							            		'width'			:modalWidth,
							            		'height'		:modalHeight,
							            		'size'			:modalSize,
							            		'fileSize'		:modalFileSize
							            });
			}else {
				$rootScope.requirements.splice($rootScope.indexFeature, 1,{	'title'			:$scope.modalTitle,
														            		'description'	:$scope.modalDescription,
														            		'format'		:$scope.modalFormat,
														            		'duration'		:$scope.modalduration,
														            		'maxLength'		:$scope.modalmaxLength,
														            		'width'			:$scope.modalWidth,
														            		'height'		:$scope.modalHeight,
														            		'size'			:$scope.modalSize,
														            		'fileSize'		:$scope.modalFileSize
														            	});
			}
            $rootScope.addFeature = true;

		};

		$scope.sizeFile = function(size){
			$scope.modalSize = size;
		};

		$scope.formatFile = function(format){
			$scope.modalFormat = format;
		};
    }])

})();



