'use strict';

var iccan = angular.module('iccan',[ 'ngRoute']);




  iccan.config(['$routeProvider',function($routeProvider){
      $routeProvider.when('/login',{
          templateUrl:'partials/login.html',
          controller:'LoginCtrl'
      })

          .when('/taakbeheer',{
              templateUrl:'partials/taakbeheer.html',
              controller:'TaakCtrl'
          })

          .when('/license',{
              templateUrl:'partials/license.html',
              controller:'LicenseCtrl'
          })
          .when('/vraagbeheer',{
              templateUrl:'partials/vraagbeheer.html',
              controller:'VraagCtrl'
          })

          .otherwise({
              redirectTo:'/login',
              controller:'LoginCtrl'
          });
  }]);

iccan.config(['$httpProvider', function($httpProvider){

    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];


}]);

      iccan.controller('LoginCtrl', ['$scope','$location','$http', function($scope,$location,$http,$templateCache) {
          $scope.user=null;
          $scope.email = null;
          $scope.pass = null;
          $scope.confirm = null;
          $scope.naam=null;
          $scope.achternaam=null;
          $scope.email=null;
          $scope.geboortedatum=null;
          $scope.createMode = false;

          $scope.titel="Login";



          $scope.createAccount = function(){

              $location.path('/license');

          }

          $scope.login=function(){



                    var url = "http://scripts.iccan.be/login.php";
              var FormData={
                  'username':$scope.usern,
                   'password':$scope.pass
              };



              $http({
                  method:'POST',
                  url:url,
                  data:FormData,
                  headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                  cache:$templateCache

                  })

                  .success(function(response,status){

                      $scope.content = JSON.stringify(response);
                      $scope.status = status;
                      alert($scope.content);

                  })
             .error(function(response,status){

                      $scope.content = response;
                      $scope.status=status;
                      alert(status);
                      alert($scope.content);

              })


          }



  }]);

iccan.controller('LicenseCtrl',['$scope','$location',function($scope,$location){

    $scope.accept=function(){

        $location.path('/vraagbeheer');
    }

}]);


iccan.service('VraagService',function(){

var i =0;

    var vragen = [{
        id: 1,
        'name': 'Vraag 1',
        'type': 'schaal'
    },
        {
            id: 2,
            'name': 'Vraag 2',
            'type': 'janee'
        }];


    this.get = function(id) {
        for (i in vragen) {
            if (vragen[i].id == id) {
                return vragen[i];
            }
        }
        return 0;

    };

    this.list = function() {
        return vragen;
    };


});

iccan.controller('VraagCtrl',['$scope','VraagService',function($scope,VraagService){

   var check =true;
    var check2=false;

        $scope.vraag = VraagService.get(1);

    $scope.nextQuestion=function(){
        $scope.vraag=VraagService.get(2);
       check =false;
        check2=true;

    }







}]);

