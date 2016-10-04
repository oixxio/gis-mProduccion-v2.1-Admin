(function () {
    'use strict';

    angular.module('app.dashboard').
    controller('indexController', [
        '$scope','$location','loginFactory','$http','$rootScope','databaseFactory','linkFactory','$uibModal',
                function($scope,$location,loginFactory,$http,$rootScope,databaseFactory,linkFactory,$uibModal){

        /*------------------------------------------------Variables--------------------------------------------------------*/
        $scope.loggedUser = {};   

        /*-----------------------------------------------------------------------------------------------------------------*/
        /**
         * Obtiene el path de un nodo y lo convierte a string en forma 'Name1>Name2>Name3'
         */
        function getNodeById(id, arrayTree) {
            for (var i = 0; i < arrayTree.length; i++) {
                if (arrayTree[i].nodeID == id) {
                    return arrayTree[i];
                }
            }
            return -1; //Si no lo encuentra, retorna '-1'
        }     
        function getNodePath(node, arrayTree) {

            //INIT
            var nodePath = [];
            var nodes = [];
            var i = 0;
            nodes[0] = node;
            nodePath[0] = node.nodeName;

            while(nodes[i] != -1) {         
                nodes[i+1] = getNodeById(nodes[i].parentID, arrayTree);
                nodePath[i+1] = nodes[i+1].nodeName;
                i++;
            }
            nodePath.pop();
            return nodePath.reverse();
        }
        function getNodePathString(node,arrayTree) {
            var nodePath = [];
            var nodePathString = "";

            nodePath = getNodePath(node,arrayTree);
            nodePath.pop();
            nodePathString = nodePath[0];

            for (var i = 1; i < nodePath.length; i++) {
                nodePathString += " > " + nodePath[i];
            }

            return nodePathString;
        }
        $scope.getDepartments = function(){
            databaseFactory.getRegionTree().then(function(response){
                var path = new Array;
                var deptos = new Array;
                
                for (var i = 0; i < response.data.length; i++) {
                    path = getNodePath(response.data[i],response.data)
                    if(path.length == 3){                        
                        deptos.push({'id': response.data[i].nodeID ,
                            'region':path[0],
                            'prov':path[1],
                            'depto':path[2]})
                    }
                }                
                $scope.departamentos = deptos;
            })  
        }
        $scope.getDepartments();
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

        $scope.userSignOut = function() {
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('userLastName');
            sessionStorage.removeItem('userGrade');
            $location.path('/'); 
        };   

        $scope.getNodeData = function(node){
            var id = node.id
            var t = 'region'
            databaseFactory.getGeneralData(id,t).then(function(response){
                linkFactory.setModalDG(response.data);
                console.log(JSON.stringify(response.data))
                databaseFactory.getTreemap(id,t).then(function(response){
                    linkFactory.setModalT(response.data);
                    console.log(JSON.stringify(response.data))
                    databaseFactory.getScatter(id,t).then(function(response){
                        linkFactory.setModalS(response.data);
                        console.log(JSON.stringify(response.data))
                        $scope.open();
                    })
                })
            })
        }
        /*[Start] Modal Controls*/
            $scope.open = function (size) {
            var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'myModalContent.html',
              controller: 'modalController',
              //controllerAs: '$ctrl',
              size: size,
              resolve: {
                items: function () {
                  return $scope.items;
                }
              }
          });
      }
            
        /*[End] Modal Controls*/
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

        
    }])

})();