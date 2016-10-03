(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('adminAppsController', ['$scope','$location','$http','$parse', '$window','dataFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,dataFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

        $scope.appName = ""
        $scope.appDevName = ""
        $scope.appState = ""
        $scope.appInfoDev = [];

        $scope.appRadioModel = ""
        console.log($scope.radioModel);

        $scope.readUsers = function() {
            var currentUserRef = firebase.auth().currentUser;
            databaseRef.ref('Users').once('value').then(function(snapshotUsers) {
                $scope.users = snapshotUsers.val().Developers;
            }).then(function(quePaso){databaseRef.ref('Apps').once('value').then(function(snapshotApps) {
                $scope.Apps = snapshotApps.val();
                var userOnline = $scope.users;
                var appsOnline = $scope.Apps;
                var indexUser = Object.keys(appsOnline);
                for (var i = 0; i < Object.keys(appsOnline).length; i++) {
                    
                    var auxApps = appsOnline[indexUser[i]];
                    var keysApps = Object.keys(appsOnline[indexUser[i]]);
                    var admVectWithoutKey = auxApps[keysApps[0]].Name;

                    if (userOnline[indexUser[i]].nameCreate) {
                        var auxUser = userOnline[indexUser[i]].nameCreate;

                    }else {
                        var auxUser = userOnline[indexUser[i]];
                        var keysUser = Object.keys(userOnline[indexUser[i]]);
                        auxUser = auxUser[keysUser[0]].nameCreate;
                        console.log("Paso 2b", auxUser[keysUser[0]]);
                    }

                    if (auxApps[keysApps[0]].Destacada) {
                        var admAppRadioModel = "Si"
                    }else {
                        var admAppRadioModel = "No"
                    }

                    $scope.appInfoDev.push({'appName' : admVectWithoutKey,
                                            'appDevName' : auxUser,
                                            'appState' : "x",
                                            'appRadioModel' : admAppRadioModel
                                            });
                }
                $scope.$apply();
                
                });
            });
        };
        
        $scope.highlightApp = function(data,appName){
            console.log(data,appName);
            databaseRef.ref('Apps').once('value').then(function(snapshotApps) {
            $scope.Apps = snapshotApps.val();
            var userOnline = $scope.users;
            var appsOnline = $scope.Apps;
            for (var i = 0; i < Object.keys(appsOnline).length; i++) {
                var indexUser = Object.keys(appsOnline);
                var auxApps = appsOnline[indexUser[i]];
                var keysApps = Object.keys(appsOnline[indexUser[i]]);
                var admVectWithoutKey = auxApps[keysApps[0]].Destacada;
                if (auxApps[keysApps[0]].Name === appName) {
                    console.log('Apps/' + indexUser[i] + '/' + keysApps[0]); 
                    firebase.database().ref('Apps/' + indexUser[i] + '/' + keysApps[0]).update({
                        Destacada: data
                    });
                }      
            }
            });
        };        

    }])
})();


