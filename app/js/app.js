'use strict';

var username = "anonymous";




var iccan = angular.module('iccan',[ 'ngRoute','mobile-angular-ui','ngTouch','shoppinpal.mobile-menu','ui.bootstrap']);



iccan.directive('youtube', function($sce) {
    return {
        restrict: 'EA',
        scope: { code:'=' },
        replace: true,
        template: '<div style="height:400px;"> <iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
        link: function (scope) {
            console.log('here');
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl(newVal);
                }
            });
        }
    };
});

iccan.directive('mySlideController', ['$swipe',
    function($swipe) {
        return {
            restrict: 'EA',
            link: function(scope, ele, attrs, ctrl) {
                var startX, pointX;
                $swipe.bind(ele, {
                    'start': function(coords) {
                        startX = coords.x;
                        pointX = coords.y;
                    },
                    'move': function(coords) {
                        var delta = coords.x - pointX;
// ...
                    },
                    'end': function(coords) {
// ...
                    },
                    'cancel': function(coords) {
// ...
                    }
                });
            }
        }
    }]);

iccan.run(['$rootScope','$spMenu',function($rootScope,$spMenu) {
    $rootScope.$spMenu=$spMenu;

}]);

iccan.provider("$spMenu", function(){
    this.$get = [function(){
        var menu = {};

        menu.show = function show(){
            var menu = angular.element(document.querySelector('#sp-nav'));
            console.log(menu);
            menu.addClass('show');
        };

        menu.hide = function hide(){
            var menu = angular.element(document.querySelector('#sp-nav'));
            menu.removeClass('show');
        };

        menu.toggle = function toggle() {
            var menu = angular.element(document.querySelector('#sp-nav'));
            menu.toggleClass('show');
        };

        return menu;
    }]});

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
        .when('/profiel',{
        templateUrl:'partials/profile.html',
        controller:'ProfileCtrl'
        })
        .when('/statistiek',{
        templateUrl:'partials/statistiek.html',
        controller:'StatisticCtrl'
        })
        .when('/lostpsw',{
            templateUrl:'partials/lostpsw.html',
            controller:'PasswordCtrl'
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



iccan.controller('PasswordCtrl',['$scope','$location','$http',function($scope,$location,$http){




    $scope.sendPassword = function(){


        var url = "http://iccan.be/scripts/requestpasschange.php";
        var FormData={
            'username':$scope.user,
            'email': $scope.email

        };



        $http({
            method:'POST',
            url:url,
            data:FormData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}


        })

            .success(function(data,status){
                $scope.status = status;
                $scope.msgs = data.berichten;

                $scope.msg =$scope.msgs[0];
                if($scope.msg.succes==1){
                alert("Email has been successfully send!")
                }else{
                    alert("Invalid username/email");
                }
            })
            .error(function(data,status){


                $scope.status=status;
                alert("Invalid username/email");


            });

    }




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
    $scope.geslacht = null;





    $scope.lostpsw = function(){

        $location.path('/lostpsw');

    };

$scope.register = function(){

  $location.path('/register');


};


    $scope.createAccount = function(){

if($scope.pass==$scope.confirm){


        var pswh=  CryptoJS.SHA256($scope.pass);


        $scope.saltpsw = pswh + "ditzefoiqzeisEHOEUIHF54685çé!";



            var mydate = new Date($scope.geboortedatum);

        var date = mydate.getDay() + "/"+mydate.getMonth() + "/" + mydate.getFullYear();



       var url = "http://iccan.be/scripts/registreer.php";
        var FormData={
            'username':$scope.user,
            'password':$scope.saltpsw,
            'name':$scope.naam,
            'surname':$scope.achternaam,
            'sex':$scope.geslacht,
            'birthdate':date,
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




                if($scope.content.succes == 1 ){

                    username = $scope.user;

                    $location.path('/license');

                }else{

                    $scope.err = "Invalid data";

                }




            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


            })
}else{
    alert("passwords do not match");
}




    };

    $scope.login=function(){

        var pswh=  CryptoJS.SHA256($scope.pass);


        $scope.saltpsw = pswh + "ditzefoiqzeisEHOEUIHF54685çé!";


        username = $scope.user;

        var url = "http://iccan.be/scripts/login.php";
        var FormData={
            'username':$scope.user,
            'password':$scope.saltpsw
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



                if($scope.content.succes == 1 ){

                    $location.path('/taakbeheer');

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

iccan.controller('LicenseCtrl',['$scope','$location','$http',function($scope,$location,$http){

    var url = "http://iccan.be/scripts/policy.php";
    $http.get(url)
        .success(function(data,status){

            $scope.items = data.policy;
            $scope.status = status;
            $scope.item = $scope.items[0];
         })
        .error(function(response,status){

            $scope.content = response;
            $scope.status=status;
            alert(status);
            alert($scope.content);

        });

    $scope.decline=function(){
        $location.path('/login')
    }

    $scope.accept=function(){

        $location.path('/vraagbeheer');
    }

}]);

iccan.controller('ProfileCtrl',['$scope','$http','$location',function($scope,$http,$location){

   $scope.check = false;

    $scope.username = username;

    $scope.goTaak =function(){
        $location.path('/taakbeheer');
    };

    $scope.goLogb =function(){
        $location.path('/logboek');
    };
    $scope.logout =function(){
        $location.path('/login');
    };  $scope.goProfile = function(){

        $location.path('/profiel');
    }

    $scope.editUser = function(){

        $scope.check = true;

    };

    $scope.resetQuestions=function(){


        $location.path('/vraagbeheer');
    };

    $scope.applyChanges=function(){
        var url = "http://iccan.be/scripts/edituser.php";

        if($scope.naam==null){
            $scope.naam = $scope.item.naam;

        }else{
            $scope.item.naam = $scope.naam;
        }
        if($scope.voornaam ==null){
            $scope.voornaam = $scope.item.voornaam;
        }else{
            $scope.item.voornaam = $scope.voornaam;
        }
        if($scope.email==null){
            $scope.email = $scope.item.email;
        }else{
            $scope.item.email = $scope.email;
        }
        var mydate = new Date($scope.geboortedatum);

        var date = mydate.getDay() + "/"+mydate.getMonth() + "/" + mydate.getFullYear();

        var FormData={
            'username':username,
            'name':$scope.voornaam,
            'surname':$scope.naam,
            'sex':$scope.item.geslacht,
            'birthdate':date,
            'email':$scope.email

        };



        $http({
            method:'POST',
            url:url,
            data:FormData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}


        })

            .success(function(data,status){

                $scope.contents = data.berichten;
                $scope.content = $scope.contents[0];



                $scope.status = status;



                if($scope.content.succes == 1 ){

                    $scope.check =false;



                }else{

                    $scope.err = "Invalid data";

                }




            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


            })






    };


    var url = "http://iccan.be/scripts/getuser.php";
    var FormData={
        'username':$scope.username


    };

    $http({
        method:'POST',
        url:url,
        data:FormData,
        headers:{'Content-Type': 'application/x-www-form-urlencoded'}


    })

        .success(function(data,status){

            $scope.items = data.user;
            $scope.item = $scope.items[0];
            $scope.status = status;

            $scope.edit=true;










        })
        .error(function(data,status){


            $scope.status=status;



        })







}]);

iccan.controller('TaakCtrl',['$scope','$http','$location',function($scope,$http,$location){


    $scope.user = username;

    $scope.max=10;
    $scope.value=7;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
        {stateOn: 'glyphicon-heart'},
        {stateOff: 'glyphicon-off'}
    ];


    $scope.taskComplete=function(){
        $scope.survey=true;

    }
    $scope.enterSurvey=function(taakid,score,answer){



        var url = "http://iccan.be/scripts/comptaak.php";
        var FormData={
            'username':$scope.user,
            'taakid':taakid,
            'score':$scope.scor,
            'verslag':$scope.answer

        };
        $http({
            method:'POST',
            url:url,
            data:FormData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}


        })

            .success(function(data,status){
                $scope.status = status;
            })
            .error(function(data,status){
                $scope.status=status;
                alert(status);
            });

        $scope.survey=false;
    }


    $scope.showmenu = false;
    $scope.toggleMenu=function(){
        $scope.showmenu=($scope.showmenu) ? false:true;
    };

    $scope.goTaak =function(){
        $location.path('/taakbeheer');
    };

    $scope.goLogb =function(){
        $location.path('/logboek');
    };
    $scope.logout =function(){
        $location.path('/login');
    };  $scope.goProfile = function(){

        $location.path('/profiel');
    }

$scope.showSurvey = function(){



}

    var url = "http://iccan.be/scripts/taken.php";
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

            $scope.items = data.taken;






            $scope.datas =data.berichten;
            $scope.data = $scope.datas[0];



            $scope.status = status;







        })
        .error(function(data,status){


            $scope.status=status;
            alert(status);


        });





$scope.nextFile = function(url,type,omschrijving){



if(type=="youtube"){
    $scope.image="";
    $scope.imageshow =false;
    $scope.link=true;
    $scope.Popover = omschrijving;
    $scope.PopoverTitle = "Omschrijving";
    $scope.youtbe = "https://www.youtube.com/watch?v="+url;

}else{

    $scope.Popover = omschrijving;
    $scope.PopoverTitle = "Omschrijving";
    $scope.link=false;
    $scope.imageshow=true;
    $scope.stringer = url.split("-");

    $scope.viewer = $scope.stringer[0];
    $scope.site = "http://iccan.be/"+$scope.viewer;
    $scope.image = "http://iccan.be/"+$scope.stringer[1];

    $scope.code = $scope.site;
}

};





    $scope.goToLog =function(){
        $location.path('/logboek');

    }




}]);

iccan.controller('LogbCtrl',['$scope','$http','$location',function($scope,$http,$location){
    $scope.check = false;
    $scope.user = username;

    $scope.answers = [];

    $scope.answer = 1;
    $scope.answers.push({'username':username});

    $scope.value = "10";
    $scope.options = {
        from: 1,
        to: 10,
        step: 1,
        dimension: " happy"
    };

    $scope.goTaak =function(){
        $location.path('/taakbeheer');
    };

    $scope.goLogb =function(){
        $location.path('/logboek');
    };
    $scope.logout =function(){
        $location.path('/login');
    };  $scope.goProfile = function(){

        $location.path('/profiel');
    };


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











            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


            })



    };

    $scope.nextLogQuestion=function(){







        if(i<$scope.items.length){


     if($scope.item.type=="schaal"){
                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                $scope.item= $scope.items[i];
                i++;

            }else{
         $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
         $scope.item= $scope.items[i];
         i++;

         $scope.check = false;


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










                })
                .error(function(response,status){

                    $scope.content = response;
                    $scope.status=status;
                    alert(status);
                    alert($scope.content);

                })



        }




    };

    $scope.toProfile = function(){

        $location.path('/profiel');
    };

    $scope.goBack = function(){

        $location.path('/taakbeheer')

    }

    $scope.goStatik=function(){

        $location.path('/statistiek');
    }





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

    $scope.nextQuestion=function(){




        if(i<$scope.items.length-1){







            if($scope.item.type=="schaal"){

                $scope.check=true;

                if($scope.answer>2){

                    $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});

                    i++;
                    $scope.begin=false;

                    if($scope.begin==false){


                        $scope.item= $scope.items[i];

                        if($scope.item.type=="janee"){

                            $scope.check=false;

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
                               if($scope.item.type=="schaal"){
                                   $scope.check=true;
                               }else{
                                   $scope.check=false;
                               }

                           }else{

                               $scope.item = $scope.subvragen[0];
                                $scope.sub =true;
                               if($scope.item.type=="schaal"){
                                   $scope.check=true;
                               }else{
                                   $scope.check =false;
                               }
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
                $scope.begin=false;
                i++;




            }
       }else{





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
                    $scope.sub = false;
                    $scope.overgang = true;

                    if($scope.item.type=="schaal"){
                        $scope.check=true;
                    }else{
                        $scope.check=false;
                    }




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
            $scope.overgang = true;
            $scope.sub = false;

            if($scope.item.type=="schaal"){
                $scope.check=true;
            }else{
                $scope.check=false;
            }



        }};














}]);