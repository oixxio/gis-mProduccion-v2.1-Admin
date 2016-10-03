(function () {
    'use strict'; 

    angular.module('app.dashboard').
    controller('menuLoginController', ['$scope','$location','$http','$parse', '$window','dataFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,dataFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	//var $scope = this;
    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

    	$scope.newUser = {}
		$scope.newUser.emailCreate = ""
		$scope.newUser.passwordCreate = ""
		$scope.newUser.nameCreate = ""
		$scope.newUser.photoURLCreate = "http://image.flaticon.com/icons/svg/12/12096.svg"
		$scope.newUser.dateCreate = new Date().toLocaleDateString();
		$scope.errorMessage = ""
		$scope.checkFacebookStatus = true
		$scope.gradeInfo = ""

		$scope.animationsEnabled = true;
		$scope.detectState = "";

		$scope.showLoginbox = true;
		$scope.showSignupbox = false;
		$scope.showLoading = false; 


		$scope.detectState = function(){
			if(sessionStorage.getItem('userName')){
				$location.path('/'+sessionStorage.getItem('userGrade')+'Dashboard');
			}
			else{
				$location.path('/');	
			}
		};

		$scope.onClickLogin = function(data){
			if (data === "loading") {
				$scope.showLoginbox = false;
				$scope.showSignupbox = false;
				$scope.showLoading = true;
			} else if (data === "loginbox") {
				$scope.showLoginbox = true;
				$scope.showSignupbox = false;
				$scope.showLoading = false;
			} else {
				$scope.showLoginbox = false;
				$scope.showSignupbox = true;
				$scope.showLoading = false;
			}
		};

		$scope.open = function (size) {
		    $rootScope.modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      ariaLabelledBy: 'modal-title',
		      ariaDescribedBy: 'modal-body',
		      templateUrl: 'myModalContent.html',
		      controller: 'menuLoginController',
		      //controllerAs: '$scope',
		      size: size,
		      });
		 };

		$scope.openComponentModal = function () {
		    $rootScope.modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      component: 'modalComponent',
		    });
		};

		$scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		};

		$scope.close = function(){
			$rootScope.modalInstance.dismiss('cancel');
		}

		$scope.to2 = function(data){
			$rootScope.modalInstance.dismiss('cancel');
			$location.path('/');
		}

		$scope.newUserphotoURLCreate = function (elm) {
	           var element = elm;
	            angular.element(element).click()
        }

	    $scope.userSignInWithEmailAndPassword = function(user) {

	    	loginFactory.get(user).then(function(response){
	    		sessionStorage.setItem('userName',response.data.nombre);
	    		sessionStorage.setItem('userLastName',response.data.apellido);
	    		sessionStorage.setItem('userGrade',response.data.grade);
	    		$location.path('/'+response.data.grade+'Dashboard');
	    	})
			
	    };

	    $scope.gradeState = function(data) {
			if(data === 'clients') {
	  			$scope.newUser.gradeCreate = "client";
	  			$scope.gradeInfo = "Hola futuro Cliente";
		  	} else {
		  		$scope.newUser.gradeCreate = "dev";
		  		$scope.gradeInfo = "Hola futuro Desarrollador";
		  	}
		  	console.log($scope.newUser.gradeCreate);
	    };

	   	$scope.userCreateWithEmailAndPassword = function(email, name, password) {
	   		$scope.checkFacebookStatus = false
	   		console.log(email + name + password + $scope.newUser.gradeCreate);
	    	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	    		var user = firebase.auth().currentUser;
	    		user.date = new Date().toLocaleDateString();
	    		user.password = password;

	    		console.log("y que onda 2",user,new Date().toLocaleDateString());
	    		$scope.checkFacebookStatus = false
				firebase.auth().currentUser.updateProfile({
				  	displayName: name,
                    photoURL: $scope.newUser.photoURLCreate,
                    password: password,
                    date: $scope.newUser.dateCreate
				}).then(function() {
					console.log("Sign In Success");
					var user = firebase.auth().currentUser;
					var photoUrl, uid, dataRoot, Grade;
				  	if (user) {
					  	console.log("User is signed in.",user);
					  	if (user != null) {
					  		uid = user.uid;

						  	$scope.newUser.emailCreate = user.email;
						  	$scope.newUser.passwordCreate = password;
						  	$scope.newUser.nameCreate = name;
							$scope.newUser.photoURLCreate = user.photoURL;
							
							if ($scope.newUser.gradeCreate === "client") {
								dataRoot = 'Clients';
								Grade = "client";

							}else{
								dataRoot = 'Developers';
								Grade = "dev";	
							}
							$scope.newUser.gradeCreate = dataRoot;
							console.log("newUser",$scope.newUser);
							console.log('Users/'+ dataRoot + '/' + uid);
						   	databaseRef.ref('Users/'+ dataRoot + '/' + uid).push($scope.newUser);
						   	user.grade = Grade;
						   	loginFactory.setLoggedUser(user);
						   	//$timeout(function(){$scope.initDashboard()}, 3);
						   	console.log("ref" + '/' + Grade + 'Dashboard');
						   	if (Grade === "dev") {
						   		$timeout(function(){$location.path('/' + Grade + 'DashboardWithoutApps')}, 4);
						   	}else{
								$timeout(function(){$location.path('/' + Grade + 'Dashboard')}, 4);
						   	}
						   	$scope.checkFacebookStatus = false
						}
					} else {
					  console.log("No user is signed in."); 
					}		
				},function(error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					$scope.errorMessage = error.message;
					console.log("errorCode: " + errorCode +" errorMessage: " + errorMessage);
				});
			}, function(error) {
			  	var errorCode = error.code;
				var errorMessage = error.message;
				$scope.errorMessage = error.message;
				console.log("errorCode 1: " + errorCode +" errorMessage 1: " + errorMessage);
				$scope.$apply();
			});
	    };

	    $scope.userSignInWithFacebook = function() {
			var provider = new firebase.auth.FacebookAuthProvider();

	    	firebase.auth().signInWithPopup(provider).then(function(result) {
			  	// This gives you a Facebook Access Token. You can use it to access the Facebook API.
			  	var token = result.credential.accessToken;
		        var user = result.user;
		        var providerData = user.providerData[0];
		        $scope.checkFacebookStatus = false
			  	//The signed-in user info.
			  	databaseRef.ref('Users').once('value').then(function(snapshot) {
			  		if (snapshot.val().Clients) {
						var clientsGrade = Object.keys(snapshot.val().Clients);
					}else{
						var clientsGrade = new Array();
					}

					if (snapshot.val().Developers) {
						var devGrade = Object.keys(snapshot.val().Developers);
					}else{
						var devGrade = new Array();
					}

	  				var Grade = "";
	  				for (var i = 0; i < clientsGrade.length; i++) {
	  					if(clientsGrade[i] === user.uid){
							Grade = "client";
						}
	  				}

	  				for (var i = 0; i < devGrade.length; i++) {
	  					if(devGrade[i] === user.uid){
							Grade = "dev";
						}
	  				}

					if(Grade !== "client" && Grade !== "dev"){
						$scope.errorMessage = "El usuario no existe.";
						console.log("errorCode: " + $scope.errorMessage);
						firebase.auth().currentUser.delete().then(function() {
						  	console.log("User deleted.");
						}, function(error) {
						  	console.log("An error happened.");
						});
						$scope.$apply();
					}else{
						user.grade = Grade;
						user.password = "";
						user.indexGrade = new Array();
						loginFactory.setLoggedUser(user);
			   			$timeout(function(){$location.path('/' + Grade + 'Dashboard')}, 9);
					}
				});
			}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential;
			  $scope.errorMessage = error.message + error.email + error.credential;
			  console.log("errorCode: " + errorCode +" errorMessage: " + errorMessage +" email: " + email+" credential: " + credential);
			});
	    };

	    function userSignUpWithFacebook(close, userCreateWithFacebook){
		    //algo aca
		    close('close');

		    //sigo... algo aca
		    userCreateWithFacebook('userCreateWithFacebook');
		}

	    $scope.callbackFacebook = function(data){
			userSignUpWithFacebook(
			    function(quePaso){
			    	$rootScope.modalInstance.dismiss('cancel');
			       	console.log(quePaso);
				},
				function(quePaso){
					var provider = new firebase.auth.FacebookAuthProvider();

			    	firebase.auth().signInWithPopup(provider).then(function(result) {
						// This gives you a Facebook Access Token. You can use it to access the Facebook API.
					  	var token = result.credential.accessToken;
				        var user = result.user;
				        var providerData = user.providerData[0];
				        var userAuth = firebase.auth().currentUser;
				        $scope.checkFacebookStatus = false
			    		databaseRef.ref('Users').once('value').then(function(snapshot) {
					  		if (snapshot.val().Clients) {
								var clientsGrade = Object.keys(snapshot.val().Clients);
							}else{
								var clientsGrade = new Array();
							}

							if (snapshot.val().Developers) {
								var devGrade = Object.keys(snapshot.val().Developers);
							}else{
								var devGrade = new Array();
							}
			  				var Grade = "";
			  				for (var i = 0; i < clientsGrade.length; i++) {
			  					if(clientsGrade[i] === user.uid){
									Grade = "client";
								}
			  				}
	  				
			  				for (var i = 0; i < devGrade.length; i++) {
			  					if(devGrade[i] === user.uid){
									Grade = "dev";
								}
			  				}

							if(Grade === "client" || Grade === "dev"){
								$scope.errorMessage = "Ya tienes una cuenta desde FaceBook";
								console.log($scope.errorMessage);
								$window.alert($scope.errorMessage);
								$scope.$apply();
								$scope.checkFacebookStatus = false
							}else{
								databaseRef.ref('Users/' + data + '/' + user.uid).once('value').then(function(snapshot) {
								  	if (snapshot.val() == null || snapshot.val() === undefined) {
								  		$scope.newUser.emailCreate = providerData.email
								  		$scope.newUser.gradeCreate = data
										$scope.newUser.passwordCreate = ""
										$scope.newUser.nameCreate = providerData.displayName
										$scope.newUser.photoURLCreate = providerData.photoURL

										databaseRef.ref('Users/'+ data + '/' + user.uid).push($scope.newUser);
								  	}

								  	if (data === 'Clients/') {
							  			user.grade = "client";
								  	} else {
								  		user.grade = "dev";
								  	}
								  	providerData.password = "";
									loginFactory.setLoggedUser(user);
							   		$timeout(function(){$location.path('/' + providerData.grade + 'Dashboard')}, 3);
								});
							}
							$scope.$apply();
						});
					}).catch(function(error) {
					  	// Handle Errors here.
					  	var errorCode = error.code;
					  	var errorMessage = error.message;
					  	// The email of the user's account used.
					  	var email = error.email;
					  	// The firebase.auth.AuthCredential type that was used.
					  	var credential = error.credential;
					  	$scope.errorMessage = error.message + error.email + error.credential;
					  	console.log("errorCode: " + errorCode +" errorMessage: " + errorMessage +" email: " + email+" credential: " + credential);
					});
			       	console.log(quePaso);
			    }
			);
		};

		$scope.badges = function(role){
            if(role === 'dev'){
                databaseRef.ref('Apps/' + $scope.loggedUser.uid).on('value', function(snapshot) {
                  return Object.keys(snapshot.val()).length;
                });
            }
        };

    }])

})();

