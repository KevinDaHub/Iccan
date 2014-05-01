'use strict';


var iccan = angular.module('iccan.controllers', [])


/**
 * Wachtwoord reset
 */
iccan.controller('PasswordCtrl',['$scope','$location','dataservice',function($scope,$location,dataservice){




    $scope.sendPassword = function(){

        var FormData={
            'username':$scope.user,
            'email': $scope.email

        };
        var handleSucces = function(data,status){
            $scope.status = status;
            $scope.msgs = data.berichten;

            $scope.msg =$scope.msgs[0];
            if($scope.msg.succes==1){
                alert("Email has been successfully send!")
            }else{
                alert("Invalid username/email");
            }

        };
        dataservice.postItem('POST','http://iccan.be/scripts/requestpasschange.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);

    }




}]);

/**
 * De login screen met de nodige validaties.
 */
iccan.controller('LoginCtrl', ['$scope','$location','dataservice', function($scope,$location,dataservice) {
    $scope.gebruiker=null;
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
    $scope.createAccount = function(user){

        if(user.gebruiker ==null
            || user.pass ==null
            || user.confirm==null || user.naam==null || user.achternaam==null || user.email==null ||user.geboortedatum==null ||user.geslacht==null ){

$scope.err="vul alles in";
        }else{
        if($scope.pass==$scope.confirm){


            var pswh=  CryptoJS.SHA256(user.pass);


            $scope.saltpsw = pswh + "ditzefoiqzeisEHOEUIHF54685çé!";



            var mydate = new Date(user.geboortedatum);

            var date = mydate.getDay() + "/"+mydate.getMonth() + "/" + mydate.getFullYear();




            var FormData={
                'username':user.gebruiker,
                'password':$scope.saltpsw,
                'name':user.naam,
                'surname':user.achternaam,
                'sex':user.geslacht,
                'birthdate':date,
                'email':user.email

            };

            var handleSucces = function(data,status){
                $scope.contents = data.berichten;
                $scope.content = $scope.contents[0];
                $scope.status = status;

                if($scope.content.succes == 1 ){
                    username = user.gebruiker;
                    $location.path('/license');

                }else{

                    $scope.err = "Invalid data";

                }

            };

            dataservice.postItem('POST','http://iccan.be/scripts/registreer.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);
        }else{
            alert("passwords do not match");
        }


}

    };
    $scope.login=function(user){

        var pswh=  CryptoJS.SHA256(user.pass);


        $scope.saltpsw = pswh + "ditzefoiqzeisEHOEUIHF54685çé!";


        username = user.gebruiker;


        var FormData={
            'username':user.gebruiker,
            'password':$scope.saltpsw
        };


        var handleSucces = function(data,status){
            $scope.contents = data.berichten;
            $scope.content = $scope.contents[0];



            $scope.status = status;



            if($scope.content.succes == 1 ){

                $location.path('/taakbeheer');

            }else{

                $scope.err = "Invalid username/password";

            }
        };

        dataservice.postItem('POST','http://iccan.be/scripts/login.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);


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

iccan.controller('ProfileCtrl',['$scope','$location','dataservice',function($scope,$location,dataservice){

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
    };
    $scope.goProfile = function(){

        $location.path('/profiel');
    }

    $scope.editUser = function(){

        $scope.check = true;

    };

    $scope.resetPsw = function(){

        var FormData={
            'username':username,
            'email': $scope.item.email

        };
        var handleSucces = function(data,status){
            $scope.status = status;
            $scope.msgs = data.berichten;

            $scope.msg =$scope.msgs[0];
            if($scope.msg.succes==1){
                alert("Email has been successfully send!")
            }else{
                alert("Invalid username/email");
            }

        };
        dataservice.postItem('POST','http://iccan.be/scripts/requestpasschange.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);

    };

    $scope.resetQuestions=function(){


        $location.path('/vraagbeheer');
    };

    $scope.applyChanges=function(){

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

        var FormData2={
            'username':username,
            'name':$scope.voornaam,
            'surname':$scope.naam,
            'sex':$scope.item.geslacht,
            'birthdate':date,
            'email':$scope.email

        };

        var handleSucces2 = function(data,status){
            $scope.contents = data.berichten;
            $scope.content = $scope.contents[0];
            $scope.status = status;

            if($scope.content.succes == 1 ){
                $scope.check =false;
            }else{

                $scope.err = "Invalid data";

            }
            dataservice.postItem('POST','http://iccan.be/scripts/edituser.php',FormData2,'application/x-www-form-urlencoded').success(handleSucces2);

    }};


    var FormData={
        'username':$scope.username


    };

    var handleSucces = function(data,status){
        $scope.items = data.user;
        $scope.item = $scope.items[0];
        $scope.status = status;
        $scope.edit=true;
    };
    dataservice.postItem('POST','http://iccan.be/scripts/getuser.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);






}]);

iccan.controller('TaakCtrl',['$scope','dataservice','$location',function($scope,dataservice,$location){


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

        var FormData={
            'username':$scope.user,
            'taakid':taakid,
            'score':$scope.scor,
            'verslag':$scope.answer

        };



        var handleSucces = function(data,status){
            $scope.status = status;

        };
        dataservice.postItem('POST','http://iccan.be/scripts/comptaak.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);

        $scope.survey=false;
    };


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


    var FormData={
        'username':$scope.user

    };



    var handleSucces = function(data,status){
        $scope.items = data.taken;
        $scope.datas =data.berichten;
        $scope.data = $scope.datas[0];
        $scope.status = status;

    };
    dataservice.postItem('POST','http://iccan.be/scripts/taken.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);


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

iccan.controller('LogbCtrl',['$scope','dataservice','$location',function($scope,dataservice,$location){
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



    var i = 1;


    var handleSucces = function(data,status){
        $scope.items = data.vragen;
        $scope.status = status;
        $scope.item = $scope.items[0];

        if($scope.item.type=="schaal"){

            $scope.check = true;

        }else{

            $scope.check = false;
        }


    };
    dataservice.getItem('http://iccan.be/scripts/logboek.php').success(handleSucces);



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

    $scope.getHistory=function(){

        $scope.user = username;


        var FormData={
            'username':$scope.user

        };

        var handleSucces = function(data,status){
            $scope.vvragen = data.vragen;
            $scope.vvraag = $scope.vvragen[0];

            $scope.states = data.berichten;
            $scope.state = $scope.states[0];
            $scope.status = status;



        };
        dataservice.postItem('POST','http://iccan.be/scripts/geschlogboek.php',FormData,'application/x-www-form-urlencoded').success(handleSucces);




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

            var handleSucces = function(data,status){
                $scope.status = status;
                $scope.berichten = response.berichten;

                $scope.bericht = $scope.berichten[0];

            };
            dataservice.postItem('POST','http://iccan.be/scripts/aantwoordenlogboek.php',$scope.answers,'application/x-www-form-urlencoded').success(handleSucces);

        }
    };

    $scope.toProfile = function(){

        $location.path('/profiel');
    };

    $scope.goBack = function(){

        $location.path('/taakbeheer')

    };
}]);

iccan.controller('VraagCtrl',['$scope','dataservice','$location',function($scope,dataservice,$location){

    var i=0;
    var j=0;

    $scope.end = false;
    $scope.answers =[];
    $scope.answer = 1;
    $scope.begin=true;
    $scope.answers.push({'username':username});


    var handleSucces = function(data,status){
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
    };

        dataservice.getItem('http://iccan.be/scripts/hoofdvraag.php').success(handleSucces);




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


                    var handleSucces = function(data,status){
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



                    };
                    dataservice.postItem('POST','http://iccan.be/scripts/subvraag.php',{vraagid:$scope.items[i].id},'application/x-www-form-urlencoded').success(handleSucces);
                }
            }
            else{

                $scope.check =false;

                $scope.answers.push({'id':$scope.item.id, 'antwoord':$scope.answer});
                $scope.begin=false;
                i++;

                $scope.item= $scope.items[i];
            }
        }else{

            var handleSucces2 = function(data,status){
                $scope.status = status;

                $location.path('/taakbeheer');

            };
            dataservice.postItem('POST','http://iccan.be/scripts/aantwoordenvragen.php',$scope.answers,'application/x-www-form-urlencoded').success(handleSucces2);

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




