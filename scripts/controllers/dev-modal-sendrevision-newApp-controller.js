(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('devModalSendrevisionNewAppController', ['$scope','$location','$http','$parse', '$window','dataFactory','$uibModal','$rootScope','$timeout',
    			function($scope,$location,$http,$parse,$window,dataFactory,$uibModal,$rootScope,$timeout){


		$scope.apkPath = "https://bd23.https.cdn.softlayer.net/80BD23/142.4.51.106/blog/wp-content/uploads/2012/03/download-apk-icon.png"
    	$scope.uploadProgressbar = "0"
    	$scope.errorMessenger = "";

    	var storageRef = firebase.storage().ref();
    	var userKeyRef = firebase.auth().currentUser.uid;
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

		};
 		
 		$scope.setApkPath = function(element){
			$scope.$apply(function() {
                $scope.apkPathFile = element.files[0];
            });
			console.log($scope.apkPathFile);

			var ApkRef = storageRef.child($scope.apkPathFile.name);
			var ApkImagesRef = storageRef.child('ApksFolder/' + userKeyRef + '-' + $scope.apkPathFile.name);
  			var uploadTask = storageRef.child('ApksFolder/' + userKeyRef + '-' + $scope.apkPathFile.name).put($scope.apkPathFile);

  			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			  	function(snapshot) {
			    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			    $scope.progressRound = Math.round(progress);
			    $scope.uploadProgressbar = 'Espere.. ' + $scope.progressRound + '% subido'
			    $scope.$apply();
			    switch (snapshot.state) {
			      case firebase.storage.TaskState.PAUSED: // or 'paused'
			        console.log('Upload is paused');
			        break;
			      case firebase.storage.TaskState.RUNNING: // or 'running'
			        console.log('Upload is running');
			        break;
			    }
			});
		};

		$scope.sendRevisionApk = function (versionNbr,versionNotes) {
			console.log("Pasa por aquí",versionNbr,versionNotes,$scope.progressRound);
			if (versionNbr ==="null" || versionNbr ===  null || versionNbr === "" || typeof versionNbr === "undefined") {
				$scope.errorMessenger = "Es necesario completar todos los campos para poder enviar su Apk";
			}else if(versionNotes ==="null" || versionNotes === null || versionNotes === "" || typeof versionNotes === "undefined") {
				$scope.errorMessenger = "Es necesario completar todos los campos para poder enviar su Apk";
			}else if($scope.progressRound ==="null" || $scope.progressRound === null || $scope.progressRound === "" || typeof $scope.progressRound === "undefined" || $scope.progressRound <= 99) {
				$scope.errorMessenger = "Es necesario completar todos los campos para poder enviar su Apk";
			}else {
				$scope.close();
				$rootScope.sendVersionInfoModalView = "showUpApp";
				$scope.open("md");
				$timeout(function(){$scope.close();}, 5000);
				
			}
			console.log("Pasa por aquí 1",$rootScope.sendVersionApk);
		};


		$scope.open = function (size) {
		    $rootScope.modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'views/modal/devNewAppModalSendrevisionInfo.html',
		      controller: 'devModalSendrevisionInfoNewAppController',
		      size: size,
		      });
		};
		
    }])

})();



