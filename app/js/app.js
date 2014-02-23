'use strict';

var username = "anonymous";

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

    $rootScope.username ="Anonymous";

});

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

        if($scope.user==null){
            $scope.err= "Vul uw gebruikersnaam in!";
        }
        if(!$scope.pass){
            $scope.err = "Vul uw wachtwoord in!";

        }
        if(!$scope.confirm){
            $scope.err = "Vul uw wachtwoord in!";
        }
        if(!$scope.naam){
            $scope.err="Vul uw naam in!";
        }
        if(!$scope.achternaam){
            $scope.err="Vul uw achternaam in";
        }
        if(!$scope.email){
            $scope.err = "Vul uw email in!";
        }
        if(!$scope.geslacht){
            $scope.err = "Vul uw geslacht!";
        }
        if(!$scope.geboortedatum){
            $scope.err="Duid uw geboortdaturm aan";
        }



    };

    $scope.login=function(){


        username = $scope.user;

        var url = "http://iccan.be/scripts/login.php";
        var FormData={
            'username':$scope.user,
            'password':$scope.pass
        };



        $http({
            method:'POST',
            url:url,
            data:FormData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            cache:$templateCache

        })

            .success(function(data,status){

                $scope.contents = data.berichten;
                $scope.content = $scope.contents[0];



                $scope.status = status;
                alert($scope.content.succes);


                if($scope.content.succes == 1 ){

                    $location.path('/license');

                }else{

                    $scope.err = "Invalid username/password";

                }




            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


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
var j=1;


$scope.answers =[];
    $scope.answer = 1;
    $scope.answers.push({'username':username});


    var url = "http://iccan.be/scripts/hoofdvraag.php";



    $http.get(url)




        .success(function(data,status){

            $scope.items = data.vragen;
            $scope.status = status;
            $scope.item = $scope.items[0];
            $scope.sub = false;

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


        $scope.sub = false;



       if(i<$scope.items.length){
       $scope.item= $scope.items[i];


           if($scope.item.type=="schaal"){

               $scope.check=true;

               if($scope.answer>2){

                   $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

                   i++;
               }

                else{


                   var ur = "http://iccan.be/scripts/subvraag.php";


                   $http({
                       method:'POST',
                       url:ur,
                       data:{vraagid:$scope.items[i].id},
                       headers:{'Content-Type': 'application/x-www-form-urlencoded'}


                   })

                       .success(function(data,status){

                           $scope.status = status;

                           $scope.subvragen = data.vragen;

                           $scope.berichts = data.berichten;
                           $scope.bericht = $scope.berichts[0];



                           if($scope.bericht.succes==0){
                               i++;

                           }else{

                               $scope.item = $scope.subvragen[0];
                                $scope.sub =true;
                           }









                       })
                       .error(function(data,status){

                           $scope.content = response;
                           $scope.status=status;
                           alert(status);
                           alert($scope.content);

                       })



               }

               }

           else{

               $scope.check =false;

              $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
               i++;
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

    $scope.nextSubQuestion =function(){

        alert("hehe");


        if(j<$scope.subvragen.length){
            $scope.item= $scope.subvragen[j];


            if($scope.item.type=="schaal"){

                $scope.check=true;

                if($scope.answer>2){


                    $scope.item = $scope.items[i];
                    $scope.sub = false;



                   // $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

                   // i++;
                }

                else{


                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                    j++;





                }

            }

            else{

                $scope.check =false;

                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                i++;
            }





        }else{

            $scope.item = $scope.items[i];
            $scope.sub = false;
            i++;

        }};














}]);