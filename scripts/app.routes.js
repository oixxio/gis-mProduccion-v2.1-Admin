(function () {
    'use strict';
    angular.module('app.dashboard')
    .config(['$routeProvider',function($routeProvider) {
		$routeProvider.
	    when('/adminDashboard',{
			templateUrl: 'views/adminDashboard.html'
		}).
	    when('/adminProjects',{
			templateUrl: 'views/adminProjects.html'
		}).
	    when('/adminApps',{
			templateUrl: 'views/adminApps.html'
		}).
	    when('/adminUsers',{
			templateUrl: 'views/adminUsers.html'
		}).
	    when('/adminBalance',{
			templateUrl: 'views/adminBalance.html'
		}).
		when('/adminProfile',{
			templateUrl: 'views/adminProfile.html'
		}).
		when('/adminAddProfile',{
			templateUrl: 'views/adminAddProfile.html'
		}).
		when('/devDashboardWithoutApps',{
			templateUrl: 'views/devDashboardWithoutApps.html'
		}).
		when('/devDashboard',{
			templateUrl: 'views/devDashboard.html'
		}).
		when('/devProjects',{
			templateUrl: 'views/devProjects.html'
		}).
		when('/devApps',{
			templateUrl: 'views/devAplicaciones.html'
		}).		
		when('/devNewApp',{
			templateUrl: 'views/devNewApp.html'
		}).
		when('/devProfile',{
			templateUrl: 'views/devProfile.html'
		}).
		 when('/devFinance',{
			templateUrl: 'views/devBalance.html'
		}).
		when('/clientDashboard',{
			templateUrl: 'views/clientDashboard.html'
		}).
		when('/clientApps',{
			templateUrl: 'views/clientApp.html'
		}).		
		when('/clientApp',{
			templateUrl: 'views/clientApp.html'
		}).
		when('/clientProfile',{
			templateUrl: 'views/clientProfile.html'
		}).
		when('/appPage',{
			templateUrl: 'views/appPage.html'
		}).					
		when('/newApp',{
			templateUrl: 'views/newApp.html'
		}).
		when('/',{
			templateUrl: 'views/menuLogin.html'
		}).
		when('/initLoading',{
			templateUrl: 'views/initLoading.html'
		})
		//.otherwise({ redirectTo: '/'})
		;
	}]);
})(); 