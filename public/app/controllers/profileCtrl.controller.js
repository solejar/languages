var app = angular.module('lang');

app.controller('profileCtrl',function(account,sharedProps){
    this.logout = function(){
        account.logout()
        sharedProps.setProperty('currPage','login')
    }

    this.editUser = function(newInfo){
        console.log('editing user')

        account.editUser(newInfo).then(function(newUser){
            account.attemptLogin(newInfo);
        })


    }

    this.removeUser = function(){
        var user = account.getUser();

        account.removeUser(user)
        this.logout();
    }

    this.getUser = function(){
        return account.getUser();
    }
})
