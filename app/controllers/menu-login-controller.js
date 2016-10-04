(function () {
    'use strict'; 

    angular.module('app.dashboard').
    controller('menuLoginController', ['$scope','$location','$http','$parse', '$window','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	//var $scope = this;

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
	   		
	    }; 

    }])

})();
