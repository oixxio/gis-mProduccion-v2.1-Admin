(function () {
    'use strict';

    angular.module('app.dashboard').
    factory('dataFactory', ['$http', function($http){  
        var db = {} 	
    	//This function returns the values located in the 'path' on the firebase database
       
        db.setApplications = function (data) { db.applications = data }
        db.getApplications = function () { return db.applications }
        db.setProjects = function (data) { db.projects = data }
        db.getProjects = function () { return db.projects }
        db.setUsers = function (data) { db.users = data }
        db.getUsers = function () { return db.users }
    	//this function overwrites an entry if alredy exists or creates an entry if not
        db.post = function (path,index,obj) { return firebase.database().ref(path).push(obj)}
        
    	return db;
    }]);

})();