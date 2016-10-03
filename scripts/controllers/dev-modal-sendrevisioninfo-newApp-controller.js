(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('devModalSendrevisionInfoNewAppController', ['$scope','$location','$http','$parse', '$window','dataFactory','$uibModal','$rootScope','$timeout',
    			function($scope,$location,$http,$parse,$window,dataFactory,$uibModal,$rootScope,$timeout){

		
		var storageRef = firebase.storage().ref();
 		var databaseRef = firebase.database();
 		
    	/*-------------------------------------------------------MODALS-----------------------------------------------------*/
		$scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		};

		$scope.close = function(){
			$rootScope.modalInstance.dismiss('cancel');
		}
		
		/*-----------------------------------------------------Functions-----------------------------------------------------*/	
		$scope.viewModalDetect = function () {
		    if ($rootScope.sendVersionInfoModalView === "upApp") {
				$scope.showEmptyField = false 
				$scope.showNoSaveApp = false
				$scope.showSaveApp = false
				$scope.showUpApp = true
		    }else if($rootScope.sendVersionInfoModalView === "incomleteFieldUpApp"){
				$scope.showEmptyField = true
				$scope.showNoSaveApp = false
				$scope.showSaveApp = false
				$scope.showUpApp = false
		    }else if($rootScope.sendVersionInfoModalView === "emptyField"){
				$scope.showEmptyField = true
				$scope.showNoSaveApp = false
				$scope.showSaveApp = false
				$scope.showUpApp = false
		    }else if($rootScope.sendVersionInfoModalView === "noSaveApp"){
				$scope.showEmptyField = false
				$scope.showNoSaveApp = true
				$scope.showSaveApp = false
				$scope.showUpApp = false
		    }else if($rootScope.sendVersionInfoModalView === "saveApp"){
				$scope.showEmptyField = false
				$scope.showNoSaveApp = false
				$scope.showSaveApp = true
				$scope.showUpApp = false
		    }else {
				$scope.showEmptyField = false
				$scope.showNoSaveApp = false
				$scope.showSaveApp = false
				$scope.showUpApp = true
		    }
		};

		
		$scope.saveDraftCopyNewAppDevModal = function(){
			
			for (var i = 0; i < $rootScope.DraftCopy.fastPlan.requirements.length; i++) {
            	delete $rootScope.DraftCopy.fastPlan.requirements[i].$$hashKey;
            }

            for (var i = 0; i < $rootScope.DraftCopy.standarPlan.requirements.length; i++) {
            	delete $rootScope.DraftCopy.standarPlan.requirements[i].$$hashKey;
            }

            for (var i = 0; i < $rootScope.DraftCopy.fullPlan.requirements.length; i++) {
            	delete $rootScope.DraftCopy.fullPlan.requirements[i].$$hashKey;
            }

		 	$rootScope.DraftCopy.State = "Borrador"
			var userId = firebase.auth().currentUser.uid;
			databaseRef.ref('Apps/' + userId).push($rootScope.DraftCopy);
			$scope.showEmptyField = false
			$scope.showNoSaveApp = false
			$scope.showSaveApp = true
			$scope.showUpApp = false
		};
		
    }])

})();



