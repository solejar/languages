var app = angular.module('lang');

app.controller('profileCtrl',function(auth,sharedProps){
    this.logout = function(){
        auth.logout()
        sharedProps.setProperty('currPage','login')
    }

    this.getUser = function(){
        return auth.getUser();
    }
})