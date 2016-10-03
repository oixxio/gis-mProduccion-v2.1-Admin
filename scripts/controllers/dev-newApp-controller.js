(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('devNewAppController', ['$scope','$location','$http','$parse', '$window','dataFactory','devAppInfoFactory','$uibModal','$rootScope','$timeout',
    			function($scope,$location,$http,$parse,$window,dataFactory,devAppInfoFactory,$uibModal,$rootScope,$timeout){


 		var storageRef = firebase.storage().ref();
 		var databaseRef = firebase.database();
 		var userKeyRef = firebase.auth().currentUser.uid;

		$scope.initNewApp = function(){
			console.log(devAppInfoFactory.getLoggedUser().boolean);
			if (!devAppInfoFactory.getLoggedUser().boolean) {
				$scope.newApp = {}
				$scope.newApp.owner = ""
				$scope.newApp.Name = ""
		    	$scope.newApp.Type = "App"
		    	$scope.newApp.Title = ""
		    	$scope.newApp.Description = ""
		    	$scope.newApp.Version = ""
		    	$scope.newApp.State = ""
		    	$scope.newApp.Rentals = 0;
		    	$scope.newApp.Demo_Url = ""
		    	$scope.newApp.Destacada = false
				$scope.newApp.iconPath = 'http://image.flaticon.com/icons/svg/188/188987.svg'
		    	//$scope.newApp.headerSmallPath = 'http://image.flaticon.com/icons/svg/188/188918.svg'
		    	$scope.newApp.headerBigPath = 'http://image.flaticon.com/icons/svg/189/189001.svg'
		    	$scope.newApp.screenshotPath = 'http://image.flaticon.com/icons/svg/189/189000.svg'
		    	$scope.newApp.Video_Url = ""
		    	$scope.newApp.versionNotes = ""
		    	$scope.newApp.principalFeatureImg1 = 'http://image.flaticon.com/icons/svg/188/188993.svg'
		    	$scope.newApp.principalFeatureTitle1 = ""
		    	$scope.newApp.principalFeatureDescription1 = ""
		    	$scope.newApp.principalFeatureImg2 = 'http://image.flaticon.com/icons/svg/188/188989.svg'
		    	$scope.newApp.principalFeatureTitle2 = ""
		    	$scope.newApp.principalFeatureDescription2 = ""
		    	$scope.newApp.principalFeatureImg3 = 'http://image.flaticon.com/icons/svg/188/188990.svg'
		    	$scope.newApp.principalFeatureTitle3 = ""
		    	$scope.newApp.principalFeatureDescription3 = ""
		    	$scope.newApp.finalPrincipalFeatureImg1 = 'http://image.flaticon.com/icons/svg/188/188988.svg'
		    	$scope.newApp.finalPrincipalFeatureTitle1 = ""
		    	$scope.newApp.finalPrincipalFeatureDescription1 = ""
		    	$scope.newApp.finalPrincipalFeatureImg2 = 'http://image.flaticon.com/icons/svg/188/188997.svg'
		    	$scope.newApp.finalPrincipalFeatureTitle2 = ""
		    	$scope.newApp.finalPrincipalFeatureDescription2 = ""
		    	$scope.newApp.finalPrincipalFeatureImg3 = 'http://image.flaticon.com/icons/svg/188/188995.svg'
		    	$scope.newApp.finalPrincipalFeatureTitle3 = ""
		    	$scope.newApp.finalPrincipalFeatureDescription3 = ""
		    	$scope.newApp.keywords = ""
		    	$scope.newApp.owner = firebase.auth().currentUser.displayName;
				
				$scope.newApp.fastPlan = [];
				$scope.newApp.fastPlan.costMakeChange = ""
				$scope.newApp.fastPlan.timeMakeChange = ""
				$scope.newApp.fastPlan.requirements = [];

				$scope.newApp.standarPlan = [];
				$scope.newApp.standarPlan.costMakeChange = ""
				$scope.newApp.standarPlan.timeMakeChange = ""
				$scope.newApp.standarPlan.requirements = [];

				$scope.newApp.fullPlan = [];
				$scope.newApp.fullPlan.costMakeChange = ""
				$scope.newApp.fullPlan.timeMakeChange = ""
				$scope.newApp.fullPlan.requirements = [];
			} else {
				$scope.newApp = devAppInfoFactory.getLoggedUser();
			}
			console.log($scope.newApp);
		};

		$rootScope.requirements = new Array;
        $rootScope.addFeature = true;
       	$rootScope.DraftCopy = {};
        $rootScope.indexFeature = 0;
        $rootScope.sendVersionInfoModalView = ""; 
        $rootScope.sendVersionApk;

        $scope.indexTab = 0;
		$scope.animationsEnabled = true;


		var PlanTemplateUrlModal = 'views/modal/devNewAppModalRequirements.html';
		var PlanControllerModal = 'devModalRequirementsNewAppController';
		var PlanIndexModal = 0;
        
        var sendVersionInfoTemplateUrlModal = 'views/modal/devNewAppModalSendrevisionInfo.html';
		var sendVersionInfoControllerModal = 'devModalSendrevisionInfoNewAppController';
		var sendVersionTemplateUrlModal = 'views/modal/devNewAppModalSendrevision.html';
		var sendVersionControllerModal = 'devModalSendrevisionNewAppController';
        
		// -Cambie la Img del Header  
		// -La imgaen del header es un rombo cuadrado que va en la parte superior de la pantalla 
		// -Imagen formato png 
		// -200 x 200 px 
		// -Tamaño maximo 5MB

		$scope.filter$$hashKey = function(){
			for (var i = 0; i < $scope.newApp.fastPlan.requirements.length; i++) {
            	delete $scope.newApp.fastPlan.requirements[i].$$hashKey;
            }

            for (var i = 0; i < $scope.newApp.standarPlan.requirements.length; i++) {
            	delete $scope.newApp.standarPlan.requirements[i].$$hashKey;
            }

            for (var i = 0; i < $scope.newApp.fullPlan.requirements.length; i++) {
            	delete $scope.newApp.fullPlan.requirements[i].$$hashKey;
            }
		}

		$scope.detectEmptyFieldNewAppDev = function(){

			$scope.filter$$hashKey();

            var completeField = true;
			var incomplete = "";
			var fieldStatus = {};

            for (var member in $scope.newApp) {
			    if ($scope.newApp[member] ==="null" || 
			    	$scope.newApp[member] ===  null || 
			    	$scope.newApp[member] ===    "" ||	
			    	typeof $scope.newApp[member] === "undefined"){

					if (member === "finalPrincipalFeatureDescription3"){
						completeField = true;
					} else if(member === "finalPrincipalFeatureImg3"){
						completeField = true;
					} else if(member === "finalPrincipalFeatureTitle3"){
						completeField = true;
					} else if(member === "principalFeatureDescription3"){
						completeField = true;
					} else if(member === "principalFeatureImg3"){
						completeField = true;
					} else if(member === "principalFeatureTitle3"){
						completeField = true;
					} else {
						completeField = false;
						incomplete = member;
						break;
					}
			    }else {
			    	completeField = true;
			    } 
			}

			if(completeField){
				for (var memberfastPlan in $scope.newApp.fastPlan) {
			    	if ($scope.newApp.fastPlan[memberfastPlan] === "null" || 
			    		$scope.newApp.fastPlan[memberfastPlan] ===   null || 
			    		$scope.newApp.fastPlan[memberfastPlan] ===     "" ||	
			    		typeof $scope.newApp.fastPlan[memberfastPlan] === "undefined"){
							completeField = false;
							incomplete = memberfastPlan;
							break;
					}else {
						completeField = true;
					}
				}
			} 

			if(completeField){
				for (var memberstandarPlan in $scope.newApp.standarPlan) {
			    	if ($scope.newApp.standarPlan[memberstandarPlan] === "null" || 
			    		$scope.newApp.standarPlan[memberstandarPlan] ===   null || 
			    		$scope.newApp.standarPlan[memberstandarPlan] ===     "" ||	
			    		typeof $scope.newApp.standarPlan[memberstandarPlan] === "undefined"){
							completeField = false;
							incomplete = memberstandarPlan;
							break;
					}else {
						completeField = true;
					}
				}
			}

			if(completeField){
				for (var memberfullPlan in $scope.newApp.fullPlan) {
			    	if ($scope.newApp.fullPlan[memberfullPlan] === "null" || 
			    		$scope.newApp.fullPlan[memberfullPlan] ===   null || 
			    		$scope.newApp.fullPlan[memberfullPlan] ===     "" ||	
			    		typeof $scope.newApp.fullPlan[memberfullPlan] === "undefined"){
							completeField = false;
							incomplete = memberfullPlan;
							break;
					}else {
						completeField = true;
					}
				}
			}
			fieldStatus.completeField = completeField;
			fieldStatus.incomplete = incomplete;
			return fieldStatus;
		};
			

		// Enviar Revision 
		$scope.saveAndSendNewAppDev = function(){
			//Chequea si hay borrador.
			if ($scope.newApp.State === "Borrador") {
				// Chequea si hay Campos incompletos.
				var fieldStatus = $scope.detectEmptyFieldNewAppDev();
				if (fieldStatus.completeField) {
					// Abro modal de UP Versión que carga el Apk.
					$scope.open("sm",PlanIndexModal,sendVersionTemplateUrlModal,sendVersionControllerModal);	
				} else {
					// Abro modal de UP Versión de información de campos incompletos. 
					$rootScope.sendVersionInfoModalView = "emptyField";
					$scope.open("md",PlanIndexModal,sendVersionInfoTemplateUrlModal,sendVersionInfoControllerModal);
				}
			}else {
				// Abro modal de UP Versión de información y pregunto si quiero guardar los datos en borrador o no.
				$rootScope.sendVersionInfoModalView = "noSaveApp";
				$rootScope.DraftCopy = $scope.newApp;
				$scope.open("md",PlanIndexModal,sendVersionInfoTemplateUrlModal,sendVersionInfoControllerModal); 
			}
		};

		$scope.saveDraftCopyNewAppDev = function(){
			var userId = firebase.auth().currentUser.uid;
			if (devAppInfoFactory.getLoggedUser().boolean) {
				$scope.filter$$hashKey();
				databaseRef.ref('Apps/' + userId).child(devAppInfoFactory.getLoggedUser().appChildKey).set($scope.newApp);
			} else {
				$scope.newApp.State = "Borrador"
		 		$scope.filter$$hashKey();
				databaseRef.ref('Apps/' + userId).push($scope.newApp);
			}
		};

		$scope.changePageNewAppDev = function(num){
			$scope.indexTab = num;
		};

		$scope.upload = function (elm) {
	        var element = elm;
	        angular.element(element).click()
	        console.log("upload");
        }

        $scope.setIcon = function(element) {
            $scope.$apply(function() {
                $scope.iconFile = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.iconFile.name);
			var headerSmallImagesRef = storageRef.child('icons/' + userKeyRef + '-' + $scope.iconFile.name);
  			var uploadTask = storageRef.child('icons/' + userKeyRef + '-' + $scope.iconFile.name).put($scope.iconFile);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.iconPath = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 1");
    	};



		$scope.setHeaderBig = function(element) {
            $scope.$apply(function() {
                $scope.headerBigFile = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.headerBigFile.name);
			var headerSmallImagesRef = storageRef.child('HeadersBig/' + userKeyRef + '-' + $scope.headerBigFile.name);
  			var uploadTask = storageRef.child('HeadersBig/' + userKeyRef + '-' + $scope.headerBigFile.name).put($scope.headerBigFile);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.headerBigPath = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 3");
    	};

    	$scope.setScreenshot = function(element) {
            $scope.$apply(function() {
                $scope.screenshotFile = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.screenshotFile.name);
			var headerSmallImagesRef = storageRef.child('Screenshots/' + userKeyRef + '-' + $scope.screenshotFile.name);
  			var uploadTask = storageRef.child('Screenshots/' + userKeyRef + '-' + $scope.screenshotFile.name).put($scope.screenshotFile);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.screenshotPath = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 4");
    	};

    	$scope.setprincipalFeatureImg1 = function(element) {
            $scope.$apply(function() {
                $scope.principalFeatureImg1File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.principalFeatureImg1File.name);
			var headerSmallImagesRef = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg1File.name);
  			var uploadTask = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg1File.name).put($scope.principalFeatureImg1File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.principalFeatureImg1 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 5");
    	};

    	$scope.setprincipalFeatureImg2 = function(element) {
            $scope.$apply(function() {
                $scope.principalFeatureImg2File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.principalFeatureImg2File.name);
			var headerSmallImagesRef = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg2File.name);
  			var uploadTask = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg2File.name).put($scope.principalFeatureImg2File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.principalFeatureImg2 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 6");
    	};

    	$scope.setprincipalFeatureImg3 = function(element) {
            $scope.$apply(function() {
                $scope.principalFeatureImg3File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.principalFeatureImg3File.name);
			var headerSmallImagesRef = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg3File.name);
  			var uploadTask = storageRef.child('principalFeatureImg/' + userKeyRef + '-' + $scope.principalFeatureImg3File.name).put($scope.principalFeatureImg3File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.principalFeatureImg3 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 7");
    	};

    	$scope.setfinalPrincipalFeatureImg1 = function(element) {
            $scope.$apply(function() {
                $scope.pfinalPrincipalFeatureImg1File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.pfinalPrincipalFeatureImg1File.name);
			var headerSmallImagesRef = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.pfinalPrincipalFeatureImg1File.name);
  			var uploadTask = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.pfinalPrincipalFeatureImg1File.name).put($scope.pfinalPrincipalFeatureImg1File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.finalPrincipalFeatureImg1 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 8");
    	};

    	$scope.setfinalPrincipalFeatureImg2 = function(element) {
            $scope.$apply(function() {
                $scope.finalPrincipalFeatureImg2File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.finalPrincipalFeatureImg2File.name);
			var headerSmallImagesRef = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.finalPrincipalFeatureImg2File.name);
  			var uploadTask = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.finalPrincipalFeatureImg2File.name).put($scope.finalPrincipalFeatureImg2File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.finalPrincipalFeatureImg2 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 9");
    	};

    	$scope.setfinalPrincipalFeatureImg3 = function(element) {
            $scope.$apply(function() {
                $scope.finalPrincipalFeatureImg3File = element.files[0];
            });
  			
			var headerSmallRef = storageRef.child($scope.finalPrincipalFeatureImg3File.name);
			var headerSmallImagesRef = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.finalPrincipalFeatureImg3File.name);
  			var uploadTask = storageRef.child('finalPrincipalFeatureImg/' + userKeyRef + '-' + $scope.finalPrincipalFeatureImg3File.name).put($scope.finalPrincipalFeatureImg3File);

			uploadTask.on('state_changed', function(snapshot){
				}, function(error) {
				  console.log("Handle unsuccessful uploads");
				}, function() {
				  var downloadURL = uploadTask.snapshot.downloadURL;
				  $scope.newApp.finalPrincipalFeatureImg3 = downloadURL;
				  $scope.$apply();
			});
			console.log("PASO 10");
    	};

    	$scope.setTabNbr = function(num) {
            $scope.indexTab = num;
    	};

    	$scope.downloadApk = function(){
    		console.log("downloadApk");
    		storageRef.child('ApksFolder/' + userKeyRef + '-' + $scope.apkPathFile.name).getDownloadURL().then(function(url) {
			  	console.log(url);
			   	$window.open(url);
			}).catch(function(error) {
			  	console.log(error);
			});

    	};

    	/*-------------------------------------------------------MODALS-----------------------------------------------------*/
    	$scope.open = function (size,PlanIndexModal,TemplateUrlModal,ControllerModal) {
    		$rootScope.indexFeature = PlanIndexModal;
		    $rootScope.modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: TemplateUrlModal,
		      controller: ControllerModal,
		      size: size,
		      });
		 };

		/*-----------------------------------------------FastPlan Modal----------------------------------------------------*/

		$scope.newFastPlan = function(){
			console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.fastPlan.requirements;
			console.log("PASO 2");
		 	$scope.open("md",PlanIndexModal,PlanTemplateUrlModal,PlanControllerModal);
		 	console.log("PASO 3");
		 	$scope.newApp.fastPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.fastPlan.requirements);
		};

		$scope.editFastPlan = function(index){
			console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.fastPlan.requirements;
			$rootScope.addFeature = false;
			$scope.open("md",index,PlanTemplateUrlModal,PlanControllerModal);
			console.log("PASO 3");
		 	$scope.newApp.fastPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.fastPlan.requirements);
		};

		$scope.deleteFastPlan = function(row){
		 	$scope.newApp.fastPlan.requirements.splice(row, 1);
		};

		/*----------------------------------------------StandarPlan Modal---------------------------------------------------*/

		$scope.newStandarPlan = function(){
		 	console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.standarPlan.requirements;
			console.log("PASO 2");
		 	$scope.open("md",PlanIndexModal,PlanTemplateUrlModal,PlanControllerModal);
		 	console.log("PASO 3");
		 	$scope.newApp.standarPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.standarPlan.requirements);
		};

		$scope.editStandarPlan = function(index){
			console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.standarPlan.requirements;
			$rootScope.addFeature = false;
			$scope.open("md",index,PlanTemplateUrlModal,PlanControllerModal);
			console.log("PASO 3");
		 	$scope.newApp.standarPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.standarPlan.requirements);
		};

		$scope.deleteStandarPlan = function(row){
		 	$scope.newApp.standarPlan.requirements.splice(row, 1);
		};

		/*-----------------------------------------------fullPlan Modal----------------------------------------------------*/

		$scope.newFullPlan = function(){
		 	console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.fullPlan.requirements;
			console.log("PASO 2");
		 	$scope.open("md",PlanIndexModal,PlanTemplateUrlModal,PlanControllerModal);
		 	console.log("PASO 3");
		 	$scope.newApp.fullPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.fullPlan.requirements);
		};

		$scope.editFullPlan = function(index){
			console.log("PASO 1");
			$rootScope.requirements = $scope.newApp.fullPlan.requirements;
			$rootScope.addFeature = false;
			$scope.open("md",index,PlanTemplateUrlModal,PlanControllerModal);
			console.log("PASO 3");
		 	$scope.newApp.fullPlan.requirements = $rootScope.requirements;
		 	console.log("PASO 4",$scope.newApp.fullPlan.requirements);
		};

		$scope.deleteFullPlan = function(row){
		 	$scope.newApp.fullPlan.requirements.splice(row, 1);
		};

    }])

})();
