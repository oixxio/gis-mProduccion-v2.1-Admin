(function () { 
    'use strict';

    angular.module('app.dashboard').
    controller('clientAppsController', ['$scope','$location','$http','$parse', '$window','devAppInfoFactory','$timeout','loginFactory','$uibModal','$log','$rootScope',
    			function($scope,$location,$http,$parse,$window,devAppInfoFactory,$timeout,loginFactory,$uibModal,$log,$rootScope){

    	var databaseRef = firebase.database();
    	var storageRef = firebase.storage().ref();

        $scope.appInfoClient = [];
        $scope.appInfoRequirementPlan = [];
        $scope.State = ""
        $scope.buttonReq = ""
        $scope.functionReq = ""
        $scope.Plan = ""
        $scope.showReq = false;
        $scope.tabActive = false;
        $scope.indexTable = ""
        $scope.indexApp = ""


        $scope.readClientApps = function() {
            var user = firebase.auth().currentUser;
            databaseRef.ref('Projects/').once('value').then(function(snapshotApps) {
            $scope.appsOnline = snapshotApps.val();
            $scope.appsKeys = Object.keys($scope.appsOnline);

            for (var i = 0; i < Object.keys($scope.appsOnline).length; i++) { 

                var auxProjects = $scope.appsOnline[$scope.appsKeys[i]];

                if (auxProjects.Client === user.uid) {

                    var apps = $scope.appsOnline[$scope.appsKeys[i]];
                    if (apps.State === "Live!") {
                        $scope.State = "glyphicon glyphicon-play"
                    }else if (apps.State === "Finalizado") {
                        $scope.State = "glyphicon glyphicon-stop"        
                    }else if (apps.State === "Disponible para probar") {
                        $scope.State = "glyphicon glyphicon-alert"
                    }else{
                        $scope.State = "glyphicon glyphicon-time"
                    }

                    if (apps.Plan === 1) {
                        $scope.Plan = "Plan rapido"
                    }else if (apps.Plan === 2) {
                        $scope.Plan = "Plan Standar"        
                    }else if (apps.Plan === 3) {
                        $scope.Plan = "Plan Full"
                    }else{
                        $scope.Plan = "error"
                    }

                    var auxReq = apps.Requirements.split("/");

                    if (auxReq[0] < auxReq[1]) {
                        $scope.buttonReq = "Completar Requerimientos"
                        $scope.functionReq = true
                        
                    }else {
                        $scope.buttonReq = "Extender Alquiler"
                    }

                    var d = new Date();
                    var period = apps.Period.replace(/\D/g,'');
                    $scope.EndPeriod = sumarMes(d, period).toLocaleDateString();;

                    $scope.appInfoClient.push({   
                        'appName'           : apps.AppName,
                        'appBase'           : apps.AppBase,
                        'appPlan'           : $scope.Plan,
                        'appPeriod'         : apps.Period,
                        'appMakeTime'       : apps.MakeTime,
                        'appRequirement'    : apps.Requirements,
                        'appState'          : apps.State,
                        'appPublishedDate'  : apps.PublishedDate,
                        'appIcon'           : $scope.State,
                        'appButtonReq'      : $scope.buttonReq,
                        'appFunctionReq'    : $scope.functionReq,
                        'appEndPeriod'      : $scope.EndPeriod,
                        'appClientKey'      : apps.Client,
                        'appDevKey'         : apps.Developer,
                        'appDevChildKey'    : apps.DevChildDirectory
                                                });
                }
            }
            $scope.$apply();
            });
            console.log($scope.appInfoClient);
        };

        $scope.openReq = function(data,index){
            if (data === true) {
                $scope.showReq = true;
                $scope.tabActive = true; 
            } 
            
            $scope.indexApp = index;
            $scope.reqAppBase = $scope.appInfoClient[index].appBase
            $scope.reqAppName = $scope.appInfoClient[index].appName
            $scope.reqAppPublishedDate = $scope.appInfoClient[index].appPublishedDate
            $scope.reqAppPeriod = $scope.appInfoClient[index].appPeriod
            $scope.reqAppPlan = $scope.appInfoClient[index].appPlan
            $scope.reqAppEndPeriod = $scope.appInfoClient[index].appEndPeriod
            $scope.reqAppReq = $scope.appInfoClient[index].appRequirement
            $scope.reqAppDevKey = $scope.appInfoClient[index].appDevKey
            $scope.reqAppDevChildKey = $scope.appInfoClient[index].appDevChildKey

                
            databaseRef.ref('Apps/' + $scope.reqAppDevKey).child($scope.reqAppDevChildKey).once('value').then(function(snapshotApps) {
                $scope.appsOnline = snapshotApps.val();
                var auxPlaReq = [];

                if ($scope.reqAppPlan === "Plan rapido") {
                    $scope.appInfoRequirementPlan = $scope.appsOnline.fastPlan.requirements;
                }else if ($scope.reqAppPlan === "Plan Standar") {
                    $scope.appInfoRequirementPlan = $scope.appsOnline.fastPlan.requirements
                    for (var i = 0; i < $scope.appsOnline.standarPlan.requirements.length; i++) {
                        $scope.appInfoRequirementPlan.push($scope.appsOnline.standarPlan.requirements[i])
                    }
                }else if ($scope.reqAppPlan === "Plan Full") {
                    $scope.appInfoRequirementPlan = $scope.appsOnline.fastPlan.requirements
                    for (var i = 0; i < $scope.appsOnline.fullPlan.requirements.length; i++) {
                        $scope.appInfoRequirementPlan.push($scope.appsOnline.fullPlan.requirements[i])
                    }
                }else {} 
               
                var tipo = "";
                for (var i = 0; i < $scope.appInfoRequirementPlan.length; i++) {
                    tipo = $scope.appInfoRequirementPlan[i].format;
                    if(tipo.match(/Imagen/gi) == "Imagen" ) {
                        $scope.appInfoRequirementPlan[i].tipe = "glyphicon glyphicon-picture"
                        $scope.appInfoRequirementPlan[i].showUpButtonUp = false
                        $scope.appInfoRequirementPlan[i].showUpButtonText = false
                        $scope.appInfoRequirementPlan[i].showUpButtonFile = true
                    }else if(tipo.match(/Audio/gi) == "Audio" ) {
                        $scope.appInfoRequirementPlan[i].tipe = "glyphicon glyphicon-volume-up"
                        $scope.appInfoRequirementPlan[i].showUpButtonUp = false
                        $scope.appInfoRequirementPlan[i].showUpButtonText = false
                        $scope.appInfoRequirementPlan[i].showUpButtonFile = true
                    }else if(tipo.match(/Texto/gi) == "Texto" ) {
                        $scope.appInfoRequirementPlan[i].tipe = "glyphicon glyphicon-pencil"
                        $scope.appInfoRequirementPlan[i].showUpButtonUp = false
                        $scope.appInfoRequirementPlan[i].showUpButtonText = true
                        $scope.appInfoRequirementPlan[i].showUpButtonFile = false
                    }else if(tipo.match(/Video/gi) == "Video" ) {
                        $scope.appInfoRequirementPlan[i].tipe = "glyphicon glyphicon-facetime-video"
                        $scope.appInfoRequirementPlan[i].showUpButtonUp = false
                        $scope.appInfoRequirementPlan[i].showUpButtonText = false
                        $scope.appInfoRequirementPlan[i].showUpButtonFile = true
                    }else{
                        $scope.appInfoRequirementPlan[i].tipe = "glyphicon glyphicon-ban-circle"
                        $scope.appInfoRequirementPlan[i].showUpButtonUp = false
                        $scope.appInfoRequirementPlan[i].showUpButtonText = false
                        $scope.appInfoRequirementPlan[i].showUpButtonFile = false
                    }

                }

                console.log($scope.appInfoRequirementPlan);
            });

        };
        
        /* Función que suma o resta días a una fecha, si el parámetro días es negativo restará los días*/
        function sumarMes(fecha, mes){
            fecha.setDate(fecha.getMonth() + mes);
            return fecha;
        }

        $scope.indexTable = function (index){
            $scope.indexNgTable = index;
        };

        $scope.progress = [];
        $scope.files = [];

        $scope.upFiles = function(element){
            console.log("Paso upFiles");
            $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonUp = true
            $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonText = false
            $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonFile = false

            $scope.$apply(function() {
                $scope.apkPathFile = element.files[0];
                $scope.files.push({   
                        'upIndex'  : $scope.indexNgTable,
                        'upFile'   : $scope.apkPathFile,
                        'upName'   : $scope.apkPathFile.name
                                 });
            });

            console.log($scope.files[0].upFile);

            var filesRef = $scope.appInfoClient[$scope.indexApp].appDevKey
            var filesRefChild = $scope.appInfoClient[$scope.indexApp].appDevChildKey
            var ApkRef = storageRef.child($scope.apkPathFile.name);

            $scope.ApkImagesRef = storageRef.child('ApksFolder/' + filesRef + '/' + filesRefChild + '-' + $scope.apkPathFile.name);
            $scope.uploadTask = storageRef.child('ApksFolder/' +  filesRef + '/' + filesRefChild + '-' + $scope.apkPathFile.name).put($scope.apkPathFile);
                
            $scope.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function(snapshot) {

                for (var i = 0; i < $scope.files.length; i++) {
                    var snapSplit = snapshot.ref.toString(); //.split(filesRefChild+"-")
                    var aux = snapSplit.split(filesRefChild + '-');
                    //console.log(aux[1] + "===" + $scope.files[$scope.files[i].upIndex].upName);
                    if (aux[1] === $scope.files[i].upName) {
                        console.log("estoy viendo el snapSplit:" + $scope.files[i].upIndex);
                        $scope.progress[$scope.files[i].upIndex] = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                        $scope.appInfoRequirementPlan[$scope.files[i].upIndex].progressRound = Math.round($scope.progress[$scope.files[i].upIndex]);

                        $scope.appInfoRequirementPlan[$scope.files[i].upIndex].uploadProgressbar = Math.round($scope.progress[$scope.files[i].upIndex]) + "%"
                    }
                };                
                
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                
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

        $scope.cancelUp = function(index){
            console.log($scope.uploadTask);
            if ($scope.progressRound === 100) {
                $scope.ApkImagesRef.delete().then(function() {
                  console.log("File deleted successfully");
                }).catch(function(error) {
                  console.log("Uh-oh, an error occurred!");
                });
            }else{
                $scope.uploadTask.cancel();
                $scope.uploadProgressbar = "Cancelando..."
            }
            $timeout(function() {
                $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonUp = false
                $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonText = false
                $scope.appInfoRequirementPlan[$scope.indexNgTable].showUpButtonFile = true
            }, 2000); 
        }
        
        //Esta funcion sirve para limpiar el elemente que queda almacenado en el navegador y no te permite 
        //ejecutar la funcion onchange
        $scope.setElement = function(variable){
            var s = document.getElementById(variable);
            s.value =[];
        }   

    }])
})();


