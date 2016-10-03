(function () { 
    'use strict';

    angular.module('app.dashboard').
    controller('adminProjectsController', ['$scope','$location','$http','$parse', '$window','devAppInfoFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,devAppInfoFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

        $scope.projectsInfoAdm = [];
        $scope.State = ""


        $scope.readDevApps = function() {
            var user = firebase.auth().currentUser;
                
                databaseRef.ref('Projects/').once('value').then(function(snapshotApps) {
                $scope.appsOnline = snapshotApps.val();
                $scope.appsKeys = Object.keys($scope.appsOnline);
                
                for (var i = 0; i < Object.keys($scope.appsOnline).length; i++) {
                    
                    var project = $scope.appsOnline[$scope.appsKeys[i]];

                    if (project.State === "Live!") {
                        $scope.State = "glyphicon glyphicon-play"
                    }else if (project.State === "Finalizado") {
                        $scope.State = "glyphicon glyphicon-stop"        
                    }else if (project.State === "Disponible para probar") {
                        $scope.State = "glyphicon glyphicon-alert"
                    }else{
                        $scope.State = "glyphicon glyphicon-time"
                    }

                    $scope.projectsInfoAdm.push({   'projectAppName' : project.AppBase,
                                                    'projectAppBase' : project.AppName,
                                                    'projectPlan' : project.Plan,
                                                    'projectPeriod' : project.Period,
                                                    'projectMakeTime' : project.MakeTime,
                                                    'projectRequirement' : project.Requirements,
                                                    'projectState' : project.State,
                                                    'projectIcon' : $scope.State
                                                });
                    
                }
                $scope.$apply();
                
                });
        };
                
        $scope.openApp = function(view,index){
            // console.log("view",view);
            // var data = $scope.appsOnline[$scope.appsKeys[index]];
            // data.boolean = true
            // data.appChildKey = $scope.appsKeys[index];
            // console.log("data",data);
            // devAppInfoFactory.setLoggedUser(data); 
            // $scope.goTo(view);
        };
    }])
})();


