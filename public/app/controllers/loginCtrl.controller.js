var app = angular.module('lang')

app.controller('loginCtrl',function(sharedProps,account){

    this.attemptLogin = function(loginInfo){
        console.log('attempting login')
        account.attemptLogin(loginInfo).then(function(res){
            //console.log(res)
            console.log(res.statusCode)
            if(res.statusCode=='200'){
                console.log('about to change page to profile')
                sharedProps.setProperty('currPage','profile')
            }else{
                console.log('login error',res)
            }
        }.bind(this))

    }

    this.register = function(loginInfo){
        //something would probably happen here
        loginInfo.isAdmin = false; //or maybe on server side

        account.register(loginInfo).then(function(res){
            if(res.statusCode=='200'){

                sharedProps.setProperty('currPage','profile')
            }else{
                console.log('login error',res)
            }
        }.bind(this))

    }
});
