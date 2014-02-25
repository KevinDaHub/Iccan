'use strict';

var username = "anonymous";

var iccan = angular.module('iccan',[ 'ngRoute','mobile-angular-ui']);


iccan.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});

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
    $scope.geslacht = null;



    $scope.titel="Login";


    $scope.createAccount = function(){
        var url = "http://iccan.be/scripts/registreer.php";
        var FormData={
            'username':$scope.user,
            'password':$scope.pass,
            'name':$scope.naam,
            'surname':$scope.achternaam,
            'sex':$scope.geslacht,
            'birthdate':"25/07/1992",
            'email':$scope.email

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

                    $scope.err = "Invalid data";

                }




            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


            })





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
    $scope.check = false;
    $scope.user = username;

    $scope.answers = [];

    $scope.answer = 1;
    $scope.answers.push({'username':username});

    var i = 1;
    var url = "http://iccan.be/scripts/logboek.php";



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


    $scope.getHistory=function(){

        $scope.user = username;

        var url = "http://iccan.be/scripts/geschlogboek.php";
        var FormData={
            'username':$scope.user

        };



        $http({
            method:'POST',
            url:url,
            data:FormData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}


        })

            .success(function(data,status){

                $scope.vvragen = data.vragen;
                $scope.vvraag = $scope.vvragen[0];

                $scope.states = data.berichten;
                $scope.state = $scope.states[0];
                $scope.status = status;

                alert($scope.state.succes);



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



    }

    $scope.nextLogQuestion=function(){







        if(i<$scope.items.length){


     if($scope.item.type=="schaal"){
                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                $scope.item= $scope.items[i];
                i++;

            }






        }else{

            $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});



            var uri = "http://iccan.be/scripts/aantwoordenlogboek.php";


            $http({
                method:'POST',
                url:uri,
                data:$scope.answers,
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}


            })

                .success(function(response,status){

                    $scope.status = status;
                    $scope.berichten = response.berichten;

                    $scope.bericht = $scope.berichten[0];

                    alert($scope.bericht.succes);



                    // $location.path('/taakbeheer');




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

iccan.controller('VraagCtrl',['$scope','$http','$location',function($scope,$http,$location){

var i=0;
var j=0;


$scope.answers =[];
    $scope.answer = 1;
    $scope.begin=true;
    $scope.answers.push({'username':username});


    var url = "http://iccan.be/scripts/hoofdvraag.php";



    $http.get(url)




        .success(function(data,status){

            $scope.items = data.vragen;
            $scope.status = status;
            $scope.item = $scope.items[0];
            $scope.begin=true;
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




        if(i<$scope.items.length-1){


            if($scope.changetype==true){
                $scope.item= $scope.items[i];

            }


            if($scope.item.type=="schaal"){

                $scope.check=true;

                if($scope.answer>2){

                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

                    i++;
                    $scope.begin=false;

                    if($scope.begin==false){


                        $scope.item= $scope.items[i];

                        if($scope.item.type=="janee"){
                            alert($scope.item.naam);
                            $scope.check=false;
                            $scope.changetype=true;
                        }

                    }

                }
                else{

                   $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                    i++;




                   var ur = "http://iccan.be/scripts/subvraag.php";


                   $http({
                       method:'POST',
                       url:ur,
                       data:{vraagid:$scope.items[i-1].id},
                       headers:{'Content-Type': 'application/x-www-form-urlencoded'}


                   })

                       .success(function(data,status){

                           $scope.status = status;

                           $scope.subvragen = data.vragen;

                           $scope.berichts = data.berichten;
                           $scope.bericht = $scope.berichts[0];



                           if($scope.bericht.succes==0){

                               $scope.item= $scope.items[i];

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
                if($scope.changetype==true){
                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                    i++;


                }
                $scope.check =false;

                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                i++;
                $scope.begin=false;


            }
       }else{

           $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});



           var uri = "http://iccan.be/scripts/aantwoordenvragen.php";


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




        if(j<$scope.subvragen.length-1){







            if($scope.item.type=="schaal"){

                $scope.check=true;

                if($scope.answer>2){

                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});



                    $scope.item = $scope.items[i];
                    if($scope.item.type=="schaal"){
                        $scope.check=true;
                    }
                    $scope.sub = false;
                    $scope.overgang = true;



                   // $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

                   // i++;
                }

                else{

                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                    j++;
                    $scope.item= $scope.subvragen[j];







                }

            }

            else{


                $scope.check =false;
                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                j++;
                $scope.item= $scope.subvragen[j];





            }





        }else{

            $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

            $scope.item = $scope.items[i];

            if($scope.item.type=="schaal"){
                $scope.check=true;
            }
            $scope.overgang = true;
            $scope.sub = false;


        }};














}]);