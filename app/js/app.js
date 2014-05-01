'use strict';

var username = "anonymous";




var iccan = angular.module('iccan',['iccan.controllers', 'ngRoute','mobile-angular-ui','ngTouch','shoppinpal.mobile-menu','ui.bootstrap']);


iccan.factory('dataservice',['$http',function($http){



    return{
        getItem:function(url){
            return $http.get(url);
        },

        postItem:function(method,url,postdata,headers){

            return $http({
                method:method,
                url:url,
                data:postdata,
                headers:{'Content-Type':headers}
            })
        }
    }

}]);

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


