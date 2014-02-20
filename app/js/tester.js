var test = angular.module('test',[ 'ngRoute']);

test.config(['$httpProvider', function ($httpProvider) {
    //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}]);


test.controller('TestCtrl',function($scope,$http){


    $scope.name="hey";


    var url = "http://scripts.iccan.be/login.php";
    var FormData={
        'username':"admin",
        'password':"pass"
    };



    $http({
        method:'POST',
        url:url,
        data:FormData



    })

        .success(function(response,status){

            $scope.content = response;
            $scope.status = status;
            alert(status);
        })
        .error(function(response,status){

            $scope.content = response;
            $scope.status=status;


        })




})