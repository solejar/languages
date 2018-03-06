var app = angular.module('lang')

app.controller('loginCtrl',function(sharedProps,account){

    this.signupInfo = {}

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

    this.resetPassword = function(email){
        account.resetPassword(email).then(function(res){
            if(res.statusCode=='200'){ //email sending went well
                //do some sort of screen updating here.
            }
        })
    }

    this.disableRegister = function(formValid, signupInfo){
        let pwd = signupInfo.password;
        let pwdConf = signupInfo.passwordConfirmation;

        if(formValid){
            if(pwd===pwdConf){
                return false;
            }else{
                return true; //disable if passwords aren't equal
            }
        }else{
            return true; //disable if form invalid
        }
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

    //figure out how to connect this to a directive, still working on this
    this.checkAccountAvailability = function(entityName,type){
        account.checkAccountAvailability(entityName,type).then(function(userAvailable){
            if(userAvailable){
                //do something
            }else{
                //do something
            }
        })
    }
});
