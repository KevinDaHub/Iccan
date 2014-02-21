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
        .when('/logboek',{
            templateUrl:'partials/logbook.html',
            controller:'LogbCtrl'
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

iccan.run(function($rootScope){

    $rootScope.username ="";
    $rootScope.userna =function(name){
        this.username = name;
    }
    $rootScope.getUsern =function(){
        return this.username;
    }
})


iccan.factory('UserFactory',function(){

    return{

        name:'anonymous'
    };

});

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

    };

    $scope.login=function(){



        var url = "http://iccan.be/scripts/login.php";
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
                $scope.userna($scope.usern);


                $scope.status = status;

                $location.path('/license');



            })
            .error(function(response,status){

                $scope.content = response;
                $scope.status=status;
                alert(status);
                alert($scope.content);

            })


    };



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

iccan.controller('TaakCtrl',['$scope','$http','$location',function($scope,$http,$location){

    $scope.goToLog =function(){
        $location.path('/logboek');

    }


}]);

iccan.controller('LogbCtrl',['$scope','$http',function($scope,$http){

    var url = "http://iccan.be/scripts/logboek.php";

var j =0;

    $http.get(url)




        .success(function(data,status){

            $scope.items = data.vragen;
            $scope.status = status;
            $scope.item = $scope.items[0];

            if($scope.item.type=="schaal"){

                $scope.check = true;



            }else{

                $scope.check = false;
            }



        })
        .error(function(response,status){

            $scope.content = response;
            $scope.status=status;
            alert(status);
            alert($scope.content);

        });

    $scope.nextQuestion=function(){




        if(j<$scope.items.length){
            $scope.item= $scope.items[j++];


            if($scope.item.type=="schaal"){

                $scope.check=true;

                /*if($scope.answer<3){


                 }

                 //$scope.answers.push([{'username':$rootscope.username,'id':$scope.item.id, 'antwoord':$scope.answer}
                 ]);*/





            }else{

                $scope.check =false;

                // $scope.answers.push([{'username':$rootscope.username,'id':$scope.item.id, 'antwoord':$scope.answer}]);
            }
        }
    };




}]);

iccan.controller('VraagCtrl',['$scope','$http','$location',function($scope,$http,$location){

var i=0;
var j=0;
$scope.answers = [];
    $scope.answer = 1;
    $scope.answers.push([{'username':"test"}]);


    var url = "http://iccan.be/scripts/hoofdvraag.php";



    $http.get(url)




        .success(function(data,status){

            $scope.items = data.vragen;
            $scope.status = status;
            $scope.item = $scope.items[0];

            if($scope.item.type=="schaal"){

                $scope.check = true;



            }else{

                $scope.check = false;
            }




        })
        .error(function(response,status){

            $scope.content = response;
            $scope.status=status;
            alert(status);
            alert($scope.content);

        });

   /*var check =true;
    var check2=false;

    $scope.vraag = VraagService.get(1);
*/
    $scope.nextQuestion=function(){




       if(j<$scope.items.length){
       $scope.item= $scope.items[j++];


           if($scope.item.type=="schaal"){

               $scope.check=true;

               /*if($scope.answer<3){


               }*/

               $scope.answers.push([{'id':$scope.item.id, 'antwoord':$scope.answer}
               ]);





           }else{

               $scope.check =false;

              $scope.answers.push([{'id':$scope.item.id, 'antwoord':$scope.answer}]);
           }

       }else{



           var uri = "http://iccan.be/scripts/antwoordenvraag.php";


           $http({
               method:'POST',
               url:uri,
               data:$scope.answers,
               headers:{'Content-Type': 'application/x-www-form-urlencoded'}


           })

               .success(function(response,status){

                   $scope.status = status;

                   $location.path('/taakbeheer');




               })
               .error(function(response,status){

                   $scope.content = response;
                   $scope.status=status;
                   alert(status);
                   alert($scope.content);

               })



       }


       };














}]);