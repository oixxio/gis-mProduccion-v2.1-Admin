(function () { 
    'use strict';

    angular.module('app.dashboard').
    controller('devAppsController', ['$scope','$location','$http','$parse', '$window','devAppInfoFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,devAppInfoFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

        $scope.appsInfoDev = [];


        $scope.readDevApps = function() {
            var user = firebase.auth().currentUser;
                
                databaseRef.ref('Apps/' + user.uid).once('value').then(function(snapshotApps) {
                $scope.appsOnline = snapshotApps.val();
                $scope.appsKeys = Object.keys($scope.appsOnline);
                for (var i = 0; i < Object.keys($scope.appsOnline).length; i++) {
                    
                    var auxApps = $scope.appsOnline[$scope.appsKeys[i]];


                    // console.log(auxApps.iconPath);
                    $scope.appsInfoDev.push({'appIcon' : auxApps.iconPath,
                                             'appName' : auxApps.Name+'-'+auxApps.Version,
                                             'appState' : auxApps.State,
                                             'appRentals' : auxApps.Rentals
                                            });
                }
                // console.log($scope.appsInfoDev);
                $scope.$apply();
                
                });
        };
                
        $scope.openApp = function(view,index){
            console.log("view",view);
            var data = $scope.appsOnline[$scope.appsKeys[index]];
            data.boolean = true
            data.appChildKey = $scope.appsKeys[index];
            console.log("data",data);
            devAppInfoFactory.setLoggedUser(data); 
            $scope.goTo(view);
        };
    }])
})();


