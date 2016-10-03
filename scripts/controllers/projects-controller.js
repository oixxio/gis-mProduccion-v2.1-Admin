(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('projectController', ['$scope','$location','$http','$resource', '$window','dataFactory',
    			function($scope,$location,$http,$resource,$window,dataFactory){
        $scope.projects = dataFactory.getProjects()
    }])

})();