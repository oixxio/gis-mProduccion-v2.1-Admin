(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('adminProfileController', ['$scope','$location','$http','$resource', '$window','dataFactory','loginFactory','$timeout',
    			function($scope,$location,$http,$resource,$window,dataFactory,loginFactory,$timeout){
        
       

        var storageRef = firebase.storage().ref();
        var databaseRef = firebase.database();
        $scope.adminProfile = {}
        $scope.adminProfile.name = ""
        $scope.adminProfile.mail = ""
        $scope.adminProfile.password = ""
        $scope.adminProfile.newPassword = ""
        $scope.adminProfile.repetNewPassword = ""
        $scope.adminProfile.imgPath = ""
        $scope.isCollapsed = true;
        $scope.checkUploadProfile = true;


        $scope.guardar = function(data,num) {
            $scope.indexTab = num;
            databaseRef.ref('Users').once('value').then(function(snapshot) {
              var username = Object.keys(snapshot.val());
              console.log(username[1]);
              var userIdss = username[1];
            });
            
            var userId = 2;
            databaseRef.ref('Payments/' + userId).push($scope.newApp);

            databaseRef.ref('Payments/' + userId).on('value', function(snapshot) {
                var readApp = snapshot.val();
                
                //$scope.applicationsNumb =  Object.keys(readApp).length
                var keys = Object.keys(readApp)
                var applications = new Array()
                for (var i = 0; i < keys.length; i++) {
                    readApp[keys[i]].Key = keys[i]
                    applications[i] = readApp[keys[i]]
                }
                console.log(snapshot.val());
                console.log($scope.newApp);
                $scope.$apply()
            });
         };


        $scope.readProfile = function() {

            var ref = "";
            switch($scope.loggedUser.grade) {
                    case 'admin':
                        ref = "Admin/";
                        break;
                    case 'dev':
                        ref = "Clients/";
                        break;
                    case 'client':
                        ref = "Developers/";
                        break;
            }

            if ($scope.loggedUser.uid === firebase.auth().currentUser.uid) {
                var currentUserRef = firebase.auth().currentUser;
                var refUid = ref + currentUserRef.uid;

                $scope.adminProfile.name = currentUserRef.displayName;
                $scope.adminProfile.mail = currentUserRef.email;
                $scope.adminProfile.password = currentUserRef.password;
                $scope.adminProfile.imgPath = currentUserRef.photoURL;
                console.log("0---" + $scope.adminProfile.imgPath);
            }
            $scope.checkUploadProfile = true;
         };

        $scope.uploadProf = function (elm) {
                var element = elm;
                 angular.element(element).click(); 
        }

        $scope.setImgProfile = function(element) {

            $scope.$apply(function() {
                $scope.file = element.files[0];
            });

            var profileRef = storageRef.child($scope.file.name);
            var profileImagesRef = storageRef.child('Userphoto/' + $scope.file.name);
            var uploadTask = storageRef.child('Userphoto/' + $scope.file.name).put($scope.file);
            uploadTask.on('state_changed', function(snapshot){
                }, function(error) {
                  console.log("Handle unsuccessful uploads");
                }, function() {
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  $scope.adminProfile.imgPath = downloadURL;
                  $scope.$apply();
            });
        };

        $scope.saveProfile = function() {
            var user = firebase.auth().currentUser;
            if ($scope.adminProfile.newPassword === $scope.adminProfile.repetNewPassword) {
                if ($scope.adminProfile.newPassword !== "") {    
                    $scope.adminProfile.password = $scope.adminProfile.newPassword;
                    var newPassword = $scope.adminProfile.password;
                    user.updatePassword(newPassword).then(function() {
                      console.log("Update successful,tarde");// Update successful.
                    }, function(error) {
                      console.log("An error happened.");// An error happened.
                    });
                }else{
                console.log("el mismo pass");
                }
                console.log("newpass" + $scope.adminProfile.password);
                user.password = $scope.adminProfile.password;
                user.updateProfile({
                    displayName: $scope.adminProfile.name,
                    photoURL: $scope.adminProfile.imgPath,
                    password: $scope.adminProfile.password
                }).then(function() {
                    console.log("Update successful. Hi");
                    if (user != null) {
                        user.grade = $scope.loggedUser.grade;                  
                        console.log(user.photoURL);
                         var ref = "";
                        if($scope.loggedUser.grade === 'admin'){
                            ref = "Admin";
                        }else if($scope.loggedUser.grade === 'dev'){
                            ref = "Developers";
                        }else{
                            ref = "Clients";
                        } 
                        console.log('Users/' + ref + '/' + user.uid); 
                        firebase.database().ref('Users/' + ref + '/' + user.uid).set({
                            photoURLCreate: $scope.adminProfile.imgPath,
                            emailCreate: $scope.adminProfile.mail,
                            passwordCreate: $scope.adminProfile.password,
                            nameCreate: $scope.adminProfile.name,
                            gradeCreate: ref
                         });
                        loginFactory.setLoggedUser(user); 
                        $scope.checkUploadProfile = false;
                        $scope.$apply();
                        //$timeout(function(){$scope.initDashboard()}, 3);
                    }
                }, function(error) {
                  console.log("An error happened."); 
                });
                $scope.isCollapsed = true;
            }else{
                $scope.adminProfile.newPassword = ""
                $scope.adminProfile.repetNewPassword = ""
                scope.$apply();
            }
        };

    }])
})();


    // -------------------------readProfile--------------------------------------
    // databaseRef.ref('Users/' + refUid).once('value').then(function(snapshot) {
    //     var readApp = snapshot.val();
    //     console.log("paso" + readApp.name);
    //     $scope.applicationsNumb =  Object.keys(readApp).length
    //     var keys = Object.keys(readApp)
    //     var applications = new Array()
    //     for (var i = 0; i < keys.length; i++) {
    //         readApp[keys[i]].Key = keys[i]
    //         applications[i] = readApp[keys[i]]
    //     }
    //     $scope.adminProfile.name = applications[0].nameCreate
    //     $scope.adminProfile.mail = applications[0].emailCreate
    //     $scope.adminProfile.password = applications[0].passwordCreate
    //     $scope.adminProfile.imgPath = applications[0].photoURLCreate
    //     //console.log($scope.adminProfile.imgPath);
    //     console.log("paso");
    //     $scope.$apply()
    // });

    // $scope.uploadProf = function (elm) {
    //        var element = elm;
    //         angular.element(element).click();
    // }
    // function callBackFuntion(callbackSetImg, callbackUpdateAuth, callbackUdateDatabase){
    //     //algo aca
    //     callbackSetImg('paso 1');
    //     //sigo... algo aca
    //     callbackUpdateAuth('paso 2');
    //     //sigo ... y termino
    //     callbackUdateDatabase('terminó');
    // }

    // $scope.setImgProfile = function(element) {
    //     callBackFuntion(
    //         function(quePaso){
    //             console.log(quePaso);
    //         /*--------------------------------primero hago esto-------------------------------*/
    //             $scope.$apply(function() {
    //             $scope.file = element.files[0];
    //             });
    //             var profileRef = storageRef.child($scope.file.name);
    //             var profileImagesRef = storageRef.child('Userphoto/' + $scope.file.name);
    //             var uploadTask = storageRef.child('Userphoto/' + $scope.file.name).put($scope.file);
    //             uploadTask.on('state_changed', function(snapshot){
    //                 }, function(error) {
    //                   console.log("Handle unsuccessful uploads");
    //                 }, function() {
    //                   var downloadURL = uploadTask.snapshot.downloadURL;
    //                   $scope.adminProfile.imgPath = downloadURL;
    //                   $scope.$apply();
    //             });
    //         },//sigo... algo aca
    //         function(quePaso){
    //            console.log(quePaso);
    //         /*--------------------------------segundo hago esto-------------------------------*/
    //             firebase.auth().currentUser.updateProfile({
    //               photoURL: $scope.adminProfile.imgPath
    //             }).then(function() {
    //                 console.log("Update successful.");        
    //             }, function(error) {
    //               console.log("An error happened."); 
    //             });
    //         },//sigo ... y termino
    //         function(queHizo){
    //             console.log(queHizo);
    //         /*--------------------------------tercero hago esto-------------------------------*/
    //             var user = firebase.auth().currentUser;
    //             if (user != null) {
    //                 user.grade = $scope.loggedUser.grade;
    //                 loginFactory.setLoggedUser(user);
    //                 console.log(user.photoURL);
    //                  var ref = "";
    //                 if($scope.loggedUser.grade === 'admin'){
    //                     ref = "Admin";
    //                 }else if($scope.loggedUser.grade === 'dev'){
    //                     ref = "Developers";
    //                 }else{
    //                     ref = "Clients";
    //                 } 
    //                 console.log('Users/' + ref + user.uid);
    //                  firebase.database().ref('Users/' + ref + '/' + user.uid).set({
    //                     photoURLCreate: $scope.adminProfile.imgPath,
    //                     emailCreate: user.email,
    //                     passwordCreate: user.password,
    //                     nameCreate: user.displayName,
    //                     gradeCreate: ref
    //                  });
    //             }
    //         }
    //     );
    // };

//             $scope.setImgProfile = function(element) {

//             $scope.$apply(function() {
//                 $scope.file = element.files[0];
//             });

//             var profileRef = storageRef.child($scope.file.name);
//             var profileImagesRef = storageRef.child('Userphoto/' + $scope.file.name);
//             var uploadTask = storageRef.child('Userphoto/' + $scope.file.name).put($scope.file);
//             uploadTask.on('state_changed', function(snapshot){
//                 }, function(error) {
//                   console.log("Handle unsuccessful uploads");
//                 }, function() {
//                   var downloadURL = uploadTask.snapshot.downloadURL;
//                   $scope.adminProfile.imgPath = downloadURL;
//                   $scope.$apply();
//                   console.log("1" + $scope.adminProfile.imgPath);
//             });

//             firebase.auth().currentUser.updateProfile({
//               photoURL: $scope.adminProfile.imgPath
//             }).then(function() {
//                 console.log("Update successful.");
//                 console.log("2" + $scope.adminProfile.imgPath);
//                 var user = firebase.auth().currentUser;
//                 if (user != null) {
//                     user.grade = $scope.loggedUser.grade;                  
//                     console.log(user.photoURL);
//                      var ref = "";
//                     if($scope.loggedUser.grade === 'admin'){
//                         ref = "Admin";
//                     }else if($scope.loggedUser.grade === 'dev'){
//                         ref = "Developers";
//                     }else{
//                         ref = "Clients";
//                     } 
//                     //console.log('Users/' + ref + user.uid);
//                     console.log("3" + $scope.adminProfile.imgPath);  
//                     firebase.database().ref('Users/' + ref + '/' + user.uid).set({
//                         photoURLCreate: $scope.adminProfile.imgPath,
//                         emailCreate: user.email,
//                         passwordCreate: user.password,
//                         nameCreate: user.displayName,
//                         gradeCreate: ref
//                      });
//                     console.log("4" + $scope.adminProfile.imgPath);
//                     loginFactory.setLoggedUser(user); 
//                     console.log("5" + user);
//                 }
//             }, function(error) {
//               console.log("An error happened."); 
//             });
//         };