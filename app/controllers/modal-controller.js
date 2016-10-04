(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('modalController', [
        '$scope','$location','loginFactory','$http','$rootScope','databaseFactory','linkFactory','$uibModal','$uibModalInstance',
    	function($scope,$location,loginFactory,$http,$rootScope,databaseFactory,linkFactory,$uibModal,$uibModalInstance){

    	$scope.eDG = linkFactory.getModalDG()[0];
    	$scope.eT = linkFactory.getModalT()[0];
    	$scope.eS = linkFactory.getModalS()[0];

    	$scope.save = function(){
    		console.log($scope.eDG)
    		databaseFactory.updateGeneralData($scope.eDG,'region').then(function(response){
    			console.log(response)
    			if (response.data == "200") {
    				alert("todo piola")
    			}
    		});
    	}
    	$scope.cancel = function () {
		    $uibModalInstance.dismiss('cancel');
		  };
    }])

})();