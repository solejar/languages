var app = angular.module('lang');

app.controller('profileCtrl',function(auth,sharedProps){
    this.logout = function(){
        auth.logout()
        sharedProps.setProperty('currPage','login')
    }

    this.editUser = function(newInfo){
        console.log('editing user')

        auth.editUser(newInfo).then(function(newUser){
            auth.attemptLogin(newInfo);
        })


    }

    this.removeUser = function(){
        var user = auth.getUser();

        auth.removeUser(user)
        this.logout()
    }

    this.user = auth.getUser(); //initialize the user
})