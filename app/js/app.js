'use strict';

var username = "anonymous";

var iccan = angular.module('iccan',[ 'ngRoute','mobile-angular-ui','ngSanitize',"highcharts-ng"]);


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


iccan.directive('youtube', function($sce) {
    return {
        restrict: 'EA',
        scope: { code:'=' },
        replace: true,
        template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
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

iccan.directive('ghVisualization', function () {

    // constants
    var margin = 20,
        width = 960,
        height = 500 - .5 - margin,
        color = d3.interpolateRgb("#f77", "#77f");

    return {
        restrict: 'E',
        scope: {
            val: '=',
            grouped: '='
        },
        link: function (scope, element, attrs) {

            // set up initial svg object
            var vis = d3.select(element[0])
                .append("svg")
                .attr("width", width)
                .attr("height", height + margin + 100);

            scope.$watch('val', function (newVal, oldVal) {

                // clear the elements inside of the directive
                vis.selectAll('*').remove();

                // if 'val' is undefined, exit
                if (!newVal) {
                    return;
                }

                // Based on: http://mbostock.github.com/d3/ex/stack.html
                var n = newVal.length, // number of layers
                    m = newVal[0].length, // number of samples per layer
                    data = d3.layout.stack()(newVal);

                var mx = m,
                    my = d3.max(data, function(d) {
                        return d3.max(d, function(d) {
                            return d.y0 + d.y;
                        });
                    }),
                    mz = d3.max(data, function(d) {
                        return d3.max(d, function(d) {
                            return d.y;
                        });
                    }),
                    x = function(d) { return d.x * width / mx; },
                    y0 = function(d) { return height - d.y0 * height / my; },
                    y1 = function(d) { return height - (d.y + d.y0) * height / my; },
                    y2 = function(d) { return d.y * height / mz; }; // or `my` not rescale

                // Layers for each color
                // =====================

                var layers = vis.selectAll("g.layer")
                    .data(data)
                    .enter().append("g")
                    .style("fill", function(d, i) {
                        return color(i / (n - 1));
                    })
                    .attr("class", "layer");

                // Bars
                // ====

                var bars = layers.selectAll("g.bar")
                    .data(function(d) { return d; })
                    .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function(d) {
                        return "translate(" + x(d) + ",0)";
                    });

                bars.append("rect")
                    .attr("width", x({x: .9}))
                    .attr("x", 0)
                    .attr("y", height)
                    .attr("height", 0)
                    .transition()
                    .delay(function(d, i) { return i * 10; })
                    .attr("y", y1)
                    .attr("height", function(d) {
                        return y0(d) - y1(d);
                    });

                // X-axis labels
                // =============

                var labels = vis.selectAll("text.label")
                    .data(data[0])
                    .enter().append("text")
                    .attr("class", "label")
                    .attr("x", x)
                    .attr("y", height + 6)
                    .attr("dx", x({x: .45}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "middle")
                    .text(function(d, i) {
                        return d.date;
                    });

                // Chart Key
                // =========

                var keyText = vis.selectAll("text.key")
                    .data(data)
                    .enter().append("text")
                    .attr("class", "key")
                    .attr("y", function (d, i) {
                        return height + 42 + 30*(i%3);
                    })
                    .attr("x", function (d, i) {
                        return 155 * Math.floor(i/3) + 15;
                    })
                    .attr("dx", x({x: .45}))
                    .attr("dy", ".71em")
                    .attr("text-anchor", "left")
                    .text(function(d, i) {
                        return d[0].user;
                    });

                var keySwatches = vis.selectAll("rect.swatch")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "swatch")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", function(d, i) {
                        return color(i / (n - 1));
                    })
                    .attr("y", function (d, i) {
                        return height + 36 + 30*(i%3);
                    })
                    .attr("x", function (d, i) {
                        return 155 * Math.floor(i/3);
                    });


                // Animate between grouped and stacked
                // ===================================

                function transitionGroup() {
                    vis.selectAll("g.layer rect")
                        .transition()
                        .duration(500)
                        .delay(function(d, i) { return (i % m) * 10; })
                        .attr("x", function(d, i) { return x({x: .9 * ~~(i / m) / n}); })
                        .attr("width", x({x: .9 / n}))
                        .each("end", transitionEnd);

                    function transitionEnd() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr("y", function(d) { return height - y2(d); })
                            .attr("height", y2);
                    }
                }

                function transitionStack() {
                    vis.selectAll("g.layer rect")
                        .transition()
                        .duration(500)
                        .delay(function(d, i) { return (i % m) * 10; })
                        .attr("y", y1)
                        .attr("height", function(d) {
                            return y0(d) - y1(d);
                        })
                        .each("end", transitionEnd);

                    function transitionEnd() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr("x", 0)
                            .attr("width", x({x: .9}));
                    }
                }

                // reset grouped state to false
                scope.grouped = false;

                // setup a watch on 'grouped' to switch between views
                scope.$watch('grouped', function (newVal, oldVal) {
                    // ignore first call which happens before we even have data from the Github API
                    if (newVal === oldVal) {
                        return;
                    }
                    if (newVal) {
                        transitionGroup();
                    } else {
                        transitionStack();
                    }
                });
            });
        }
    }
});

iccan.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
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
        .when('/profiel',{
        templateUrl:'partials/profile.html',
        controller:'ProfileCtrl'
        })
        .when('/statistiek',{
        templateUrl:'partials/statistiek.html',
        controller:'StatisticCtrl'
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




iccan.controller('StatisticCtrl',['$scope','$http','$location',function($scope,$http,$location){

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.swapChartType = function () {
        if (this.chartConfig.options.chart.type === 'line') {
            this.chartConfig.options.chart.type = 'bar'
        } else {
            this.chartConfig.options.chart.type = 'line';
            this.chartConfig.options.chart.zoomType = 'x'
        }
    }

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Hello'
        },

        loading: false
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

iccan.controller('LicenseCtrl',['$scope','$location',function($scope,$location){

    $scope.accept=function(){

        $location.path('/vraagbeheer');
    }

}]);

iccan.controller('ProfileCtrl',['$scope','$http','$location',function($scope,$http,$location){

    $scope.edit = false;

    $scope.username = username;



    $scope.goBack = function(){

        $location.path("/logboek");
    }

    $scope.editUser = function(){

        $scope.edit = true;

    }

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

        var FormData={
            'username':username,
            'name':$scope.voornaam,
            'surname':$scope.naam,
            'sex':$scope.item.geslacht,
            'birthdate':"25/07/1992",
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
                alert($scope.content.succes);


                if($scope.content.succes == 1 ){

                    username = $scope.user;
                    $scope.edit =false;



                }else{

                    $scope.err = "Invalid data";

                }




            })
            .error(function(data,status){


                $scope.status=status;
                alert(status);


            })






    }


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


    $scope.user = username;



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





$scope.nextFile = function(url,type){




if(type=="youtube"){
    $scope.code = "https://www.youtube.com/v/watch?v="+url+"&html5=True";

}else{

    $scope.stringer = url.split("-");

    $scope.viewer = $scope.stringer[0];
    $scope.site = "http://iccan.be/"+$scope.viewer;

    $scope.code = $scope.site;
}

}





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