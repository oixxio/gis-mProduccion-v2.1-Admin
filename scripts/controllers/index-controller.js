(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('indexController', ['$scope','$location','loginFactory','$http','$resource','dataFactory','devAppInfoFactory','$timeout','$rootScope',
    			function($scope,$location,loginFactory,$http,$resource,dataFactory,devAppInfoFactory,$timeout,$rootScope){

        /*------------------------------------------------Variables--------------------------------------------------------*/
        $scope.loggedUser = {};   

        /*-----------------------------------------------------------------------------------------------------------------*/

    	//Funcion que permite navegar entre views
    	$scope.goTo = function (view) {
    		$location.path(view);
    	}

        //Funciones para esconder Header y sidebar, y reacomodar las clases de la view para que entren en toda la pantalla.
        $scope.hideHeaderSide = function () {
            if($location.path() === '/'){
                return true
            }
        }

        /*$scope.$on('$locationChangeStart', function(event) {
            $scope.loggedUser = loginFactory.getLoggedUser();
            $scope.devAppsNbr = $scope.loggedUser.devAppsNbr;
            if($scope.loggedUser.grade === 'admin'){
                $scope.showButtonNewApp = false
                switch($location.path()) { 
                    case '/adminDashboard':
                        break;
                    case '/adminProjects':
                        break;
                    case '/adminApps':
                        break;
                    case '/adminUsers':
                        break;
                    case '/adminBalance':
                        break;
                    case '/adminProfile':
                        break;
                    case '/adminAddProfile':
                        break;
                    default:
                        $location.path('/adminDashboard');
                }    
            }else if($scope.loggedUser.grade === 'dev'){
                $scope.showButtonNewApp = true
                switch($location.path()) {
                    case '/devDashboard':
                        break;
                    case '/devDashboardWithoutApps':
                        break;
                    case '/devProjects':
                        break;
                    case '/devApps':
                        break;
                    case '/devNewApp':
                        break;
                    case '/devFinance':
                        break;
                    case '/devProfile':
                        break;
                    default:
                        $location.path('/devDashboardWithoutApps');
                }   
            }else if($scope.loggedUser.grade === 'client'){
                $scope.showButtonNewApp = false
                switch($location.path()) {
                    case '/clientDashboard':
                        break;
                    case '/clientApps':
                        break;
                    case '/clientProfile':
                        break;
                    default:
                        $location.path('/clientDashboard');
                }    
            }else {
                $location.path('/');
            }
            //console.log($scope.showButtonNewApp);
        });*/

        $scope.userSignOut = function() {
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userLastName');
            sessionStorage.removeItem('userGrade');
            $location.path('/'); 
        };   
    }])

})();