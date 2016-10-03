(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('adminAddProfileController', ['$scope','$location','$http','$resource', '$window','dataFactory','loginFactory','$timeout',
    			function($scope,$location,$http,$resource,$window,dataFactory,loginFactory,$timeout){
        
       

        var storageRef = firebase.storage().ref();
        var databaseRef = firebase.database();
        $scope.adminAddProfile = {}
        $scope.adminAddProfile.nameCreate = ""
        $scope.adminAddProfile.emailCreate = ""
        $scope.adminAddProfile.passwordCreate = "123456"
        $scope.adminAddProfile.gradeCreate = "Admin"
        $scope.adminAddProfile.photoURLCreate = "https://cdn4.iconfinder.com/data/icons/superhero/128/thepunisher.png" 
        $scope.adminAddProfile.dateCreate = new Date().toLocaleDateString();
        $scope.newPassword = ""
        $scope.repetNewPassword = ""
        $scope.isCollapsed = true;
        $scope.checkUploadProfile = true;
        $scope.nameButtonDropdown = "Administrador ";

        $scope.uploadProf = function (elm) {
                var element = elm;
                 angular.element(element).click(); 
        }

        $scope.items = [
            'Administrador ',
            'Cliente ',
            'Desarrollador '
          ];

        $scope.status = {
            isopen: false
          };

        $scope.toggled = function(name) {
            $scope.nameButtonDropdown = name;
            if (name === "Administrador ") {
                $scope.adminAddProfile.gradeCreate = 'Admin/';
            }else if(name === "Cliente ") {
                $scope.adminAddProfile.gradeCreate = 'Clients/';
            }else{
                $scope.adminAddProfile.gradeCreate = 'Developers/';   
            }
            console.log($scope.adminAddProfile.gradeCreate);

        };
       

        $scope.saveProfile = function() {
            console.log("newpass1" + $scope.adminAddProfile.passwordCreate);
            if ($scope.newPassword === $scope.repetNewPassword) {
                if ($scope.newPassword !== "") {    
                    $scope.adminAddProfile.passwordCreate = $scope.newPassword;
                }else{
                    console.log("el mismo pass");
                }
                console.log("newpass" + $scope.adminAddProfile.passwordCreate);
                $scope.userCreateWithEmailAndPassword();
                $scope.isCollapsed = true;
            }else{
                $scope.newPassword = ""
                $scope.repetNewPassword = ""
                scope.$apply();
            }
        };

        $scope.userCreateWithEmailAndPassword = function() {
            firebase.auth().createUserWithEmailAndPassword($scope.adminAddProfile.emailCreate, $scope.adminAddProfile.passwordCreate).then(function(user) {
                //var user = firebase.auth().currentUser;
                user.password = $scope.adminAddProfile.passwordCreate;
                console.log(user);
                firebase.auth().currentUser.updateProfile({
                    displayName: $scope.adminAddProfile.nameCreate,
                    photoURL: $scope.adminAddProfile.photoURLCreate,
                    password: user.password,
                    date: $scope.adminAddProfile.dateCreate
                }).then(function() {
                    console.log("Sign In Success");
                    var user = firebase.auth().currentUser;
                    var name, email, photoUrl, uid, dataRoot;
                    if (user) {
                        console.log("User is signed in.");
                        if (user != null) {
                            uid = user.uid;
                            $scope.adminAddProfile.emailCreate = user.email;
                            $scope.adminAddProfile.passwordCreate = user.password;
                            $scope.adminAddProfile.nameCreate = user.displayName;
                            $scope.adminAddProfile.photoURLCreate = user.photoURL;
                            console.log('Users/'+ $scope.adminAddProfile.gradeCreate + '/'+ uid);
                            databaseRef.ref('Users/'+ $scope.adminAddProfile.gradeCreate + '/'+ uid).push($scope.adminAddProfile);
                            //user.grade = $scope.adminAddProfile.gradeCreate;
                            //loginFactory.setLoggedUser(user);
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

    }])
})();


    