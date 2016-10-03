(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('adminUsersController', ['$scope','$location','$http','$parse', '$window','dataFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,dataFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	//var $scope = this;
    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

        $scope.readUsers = function() {
            var currentUserRef = firebase.auth().currentUser;
            databaseRef.ref('Users').once('value').then(function(snapshot) {

                //var keys = Object.keys(snapshot.val().Admin); 
                var usersVectAdmin = Object.keys(snapshot.val().Admin);
                var usersVectClients = Object.keys(snapshot.val().Clients);
                var usersVectDevelopers = Object.keys(snapshot.val().Developers);
                $scope.userInfoVect = [];
                
                
                var userInfoAdmins = [];
                $scope.userInfoAdm = [];
                for (var i = 0; i < usersVectAdmin.length; i++) {
                    userInfoAdmins.push(snapshot.val().Admin[usersVectAdmin[i]]);
                    if (userInfoAdmins[i].emailCreate) {
                        $scope.userInfoAdm.push(userInfoAdmins[i]);
                    }else {
                        var keysAdm = Object.keys(userInfoAdmins[i]);
                        var admVectWithKey = userInfoAdmins[i];
                        var admVectWithoutKey = admVectWithKey[keysAdm[0]];
                        $scope.userInfoAdm.push(admVectWithoutKey);
                    }
                }
                
                var userInfoClients = [];
                $scope.userInfoClient = [];
                for (var i = 0; i < usersVectClients.length; i++) {
                    userInfoClients.push(snapshot.val().Clients[usersVectClients[i]]);
                    if (userInfoClients[i].emailCreate) {
                        $scope.userInfoClient.push(userInfoClients[i]);
                    }else {
                        var keysClient = Object.keys(userInfoClients[i]);
                        var clientVectWithKey = userInfoClients[i];
                        var clientVectWithoutKey = clientVectWithKey[keysClient[0]];
                        $scope.userInfoClient.push(clientVectWithoutKey);
                    }
                }

                var userInfoDevelopers = [];
                $scope.userInfoDev = [];
                for (var i = 0; i < usersVectDevelopers.length; i++) {
                    userInfoDevelopers.push(snapshot.val().Developers[usersVectDevelopers[i]]);
                    if (userInfoDevelopers[i].emailCreate) {
                        $scope.userInfoDev.push(userInfoDevelopers[i]);
                    }else {
                        var keysDev = Object.keys(userInfoDevelopers[i]);
                        var devVectWithKey = userInfoDevelopers[i];
                        var devVectWithoutKey = devVectWithKey[keysDev[0]];
                        $scope.userInfoDev.push(devVectWithoutKey);
                    }
                }

                $scope.userInfoVect = $scope.userInfoAdm.concat($scope.userInfoClient,$scope.userInfoDev);
                $scope.$apply();

            }); 
        };

    }])

})();


