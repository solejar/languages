//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

app.controller('loginCtrl',function(sharedProps,account, $mdDialog){

    this.signupInfo = {}

    this.available = {
        email: true,
        userName: true
    }

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
    this.checkAccountAvailability = function(type,entityName){

        if(entityName&&type){
            let query = {}
            query[type] = entityName

            account.getAccount(query).then(function(res){

                let user = res[0];
                this.available[type] = !(user); //if the user exists, they aren't available and vice versa

            }.bind(this))
        }
    }

    this.showPasswordPrompt = function(ev){
        var confirm = $mdDialog.prompt()
        .title('Enter your e-mail')
        .placeholder('E-mail address')
        .ariaLabel('E-mail address')
        .targetEvent(ev)
        .required(true)
        .ok('OK')
        .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result){
            console.log('resetting password of email: ',result);
            this.resetPassword(result);
        }.bind(this),function(){
            console.log('password reset was cancelled');
        })
    }

    this.resetPassword = function(email){
        account.resetPassword(email).then(function(res){
            if(res.statusCode=='200'){ //email sending went well
                //do some sort of screen updating here.
            }
        })
    }
});
