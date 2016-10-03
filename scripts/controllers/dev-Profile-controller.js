(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('devProfileController', ['$scope','$location','$http','$resource', '$window','dataFactory','loginFactory','$timeout',
    			function($scope,$location,$http,$resource,$window,dataFactory,loginFactory,$timeout){
        
       

        var storageRef = firebase.storage().ref();
        var databaseRef = firebase.database();
        $scope.devProfile = {}
        $scope.devProfile.name = ""
        $scope.devProfile.mail = ""
        $scope.devProfile.dateCreate = ""
        $scope.devProfile.password = ""
        $scope.devProfile.newPassword = ""
        $scope.devProfile.repetNewPassword = ""
        $scope.devProfile.imgPath = ""
        $scope.isCollapsed = true;
        $scope.checkUploadProfile = true;

        $scope.readProfile = function() {
            console.log($scope.loggedUser.grade,$scope.loggedUser);
            var ref = "";
            switch($scope.loggedUser.grade) {
                    case 'admin':
                        ref = "Admin/";
                        break;
                    case 'dev':
                        ref = "Developers/";
                        break;
                    case 'client':
                        ref = "Clients/";
                        break;
            }

            if ($scope.loggedUser.uid === firebase.auth().currentUser.uid) {
                var currentUserRef = firebase.auth().currentUser;
                var refUid = ref + currentUserRef.uid;

                $scope.devProfile.name = currentUserRef.displayName;
                $scope.devProfile.mail = currentUserRef.email;
                $scope.devProfile.dateCreate = currentUserRef.date;
                $scope.devProfile.password = currentUserRef.password;
                $scope.devProfile.imgPath = currentUserRef.photoURL;
                console.log("0---" + $scope.devProfile);
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
            var userPhotoRef = firebase.auth().currentUser.uid;
            var profileRef = storageRef.child($scope.file.name);
            var profileImagesRef = storageRef.child('Userphoto/' + userPhotoRef + '-' + $scope.file.name);
            var uploadTask = storageRef.child('Userphoto/' + userPhotoRef + '-' + $scope.file.name).put($scope.file);
            uploadTask.on('state_changed', function(snapshot){
                }, function(error) {
                  console.log("Handle unsuccessful uploads");
                }, function() {
                  var downloadURL = uploadTask.snapshot.downloadURL;
                  $scope.devProfile.imgPath = downloadURL;
                  $scope.$apply();
            });
        };

        $scope.saveProfile = function() {
            var user = firebase.auth().currentUser;
            if ($scope.devProfile.newPassword === $scope.devProfile.repetNewPassword) {
                if ($scope.devProfile.newPassword !== "") {    
                    $scope.devProfile.password = $scope.devProfile.newPassword;
                    var newPassword = $scope.devProfile.password;
                    user.updatePassword(newPassword).then(function() {
                      console.log("Update successful,tarde");// Update successful.
                    }, function(error) {
                      console.log("An error happened.");// An error happened.
                    });
                }else{
                console.log("el mismo pass");
                }
                console.log("newpass345" + $scope.devProfile.password,$scope.devProfile.dateCreate);
                user.password = $scope.devProfile.password;
                user.updateProfile({
                    displayName: $scope.devProfile.name,
                    photoURL: $scope.devProfile.imgPath,
                    password: $scope.devProfile.password,
                    date: $scope.devProfile.dateCreate
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
                            photoURLCreate: $scope.devProfile.imgPath,
                            emailCreate: $scope.devProfile.mail,
                            passwordCreate: $scope.devProfile.password,
                            nameCreate: $scope.devProfile.name,
                            gradeCreate: ref,
                            dateCreate: $scope.devProfile.dateCreate
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
                $scope.devProfile.newPassword = ""
                $scope.devProfile.repetNewPassword = ""
                scope.$apply();
            }
        };

        $scope.deleteProfile = function() {
            var userId = firebase.auth().currentUser.uid;
            var userPhoto = firebase.auth().currentUser.photoURL;

            firebase.storage().refFromURL(userPhoto).delete().then(function() {
                console.log("File deleted successfully");

                firebase.database().ref('Apps/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
                    console.log(snapshot.val());
                    console.log(Object.keys(snapshot.val()));
                    var refKey = Object.keys(snapshot.val());
                    var keys = Object.keys(snapshot.val());
                    var objects = snapshot.val();

                    for (var i = 0; i < keys.length; i++) {
                        console.log(i,objects[keys[i]]);
                        firebase.storage().refFromURL(objects[keys[i]].headerBigPath).delete();
                        firebase.storage().refFromURL(objects[keys[i]].headerSmallPath).delete();
                        firebase.storage().refFromURL(objects[keys[i]].iconPath).delete();
                        firebase.storage().refFromURL(objects[keys[i]].screenshotPath).delete();
                    }

                    databaseRef.ref('Apps/' + userId).remove().then(function() {
                        databaseRef.ref('Users/Developers/' + userId).remove().then(function() {
                            firebase.auth().currentUser.delete().then(function() {   
                                $timeout(function(){$scope.userSignOut()}, 5);
                                $scope.$apply();
                            }, function(error) {
                                console.log("An error happened");
                            });
                        }, function(error) {
                            console.log("An error happened");
                        });
                    }, function(error) {
                        console.log("An error happened");
                    });
                });
            }).catch(function(error) {
                console.log("Uh-oh, an error occurred!"); 
            });

            
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
    //     $scope.devProfile.name = applications[0].nameCreate
    //     $scope.devProfile.mail = applications[0].emailCreate
    //     $scope.devProfile.password = applications[0].passwordCreate
    //     $scope.devProfile.imgPath = applications[0].photoURLCreate
    //     //console.log($scope.devProfile.imgPath);
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
    //                   $scope.devProfile.imgPath = downloadURL;
    //                   $scope.$apply();
    //             });
    //         },//sigo... algo aca
    //         function(quePaso){
    //            console.log(quePaso);
    //         /*--------------------------------segundo hago esto-------------------------------*/
    //             firebase.auth().currentUser.updateProfile({
    //               photoURL: $scope.devProfile.imgPath
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
    //                     photoURLCreate: $scope.devProfile.imgPath,
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
//                   $scope.devProfile.imgPath = downloadURL;
//                   $scope.$apply();
//                   console.log("1" + $scope.devProfile.imgPath);
//             });

//             firebase.auth().currentUser.updateProfile({
//               photoURL: $scope.devProfile.imgPath
//             }).then(function() {
//                 console.log("Update successful.");
//                 console.log("2" + $scope.devProfile.imgPath);
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
//                     console.log("3" + $scope.devProfile.imgPath);  
//                     firebase.database().ref('Users/' + ref + '/' + user.uid).set({
//                         photoURLCreate: $scope.devProfile.imgPath,
//                         emailCreate: user.email,
//                         passwordCreate: user.password,
//                         nameCreate: user.displayName,
//                         gradeCreate: ref
//                      });
//                     console.log("4" + $scope.devProfile.imgPath);
//                     loginFactory.setLoggedUser(user); 
//                     console.log("5" + user);
//                 }
//             }, function(error) {
//               console.log("An error happened."); 
//             });
//         };