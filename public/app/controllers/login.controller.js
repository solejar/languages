//controller to handle the login page
angular.module('lang').controller('loginCtrl',function(sharedProps,account, $mdDialog){

    //model to hold registration form data
    this.signupInfo = {};

    //model that gets updated on email/username blur
    //used by directive to set validity, this might not be the best way to do it though
    this.available = {
        email: true,
        userName: true
    };

    this.loginFiled = false;

    //function to login, called by login button
    this.attemptLogin = function(loginInfo){
        console.log('attempting login');
        account.login(loginInfo).then(function(res){
            if(res.statusCode=='200'){//if login successful, redirect to profile page
                this.loginFailed = false;
                console.log('about to change page to profile');
                sharedProps.setProperty('currPage','profile');
            }else{
                console.log('login error',res);
                this.loginFailed = true;
            }
        }.bind(this));

    };

    //function to register, called by signup button
    this.register = function(loginInfo){

        account.register(loginInfo).then(function(res){
            if(res.statusCode=='200'){//if registration successful, redirect to profile

                sharedProps.setProperty('currPage','profile');
            }else{
                console.log('login error',res);
            }
        }.bind(this));

    };

    //function to see if account is available, used to determine validity on registration
    this.checkAccountAvailability = function(type,entityName){

        //can be used for 'email' or 'userName'
        if(entityName&&type){
            let query = {};
            query[type] = entityName;

            account.getAccount(query).then(function(res){

                let user = res[0];
                this.available[type] = !(user); //if the user exists, they aren't available and vice versa

            }.bind(this));
        }
    };

    //a prompt window for when users select 'forgot pasword'
    this.showPasswordPrompt = function(ev){
        const confirm = $mdDialog.prompt() //i just changed this to const, which may/may not be a problem
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
        });
    };

    //function that resets password of account at a certain email
    this.resetPassword = function(email){
        account.resetPassword(email).then(function(res){
            if(res.statusCode=='200'){ //email sending went well
                //do some sort of screen updating here.
            }
        });
    };
});
