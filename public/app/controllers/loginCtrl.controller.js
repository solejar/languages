var app = angular.module('lang')

app.controller('loginCtrl',function(sharedProps){
    this.signupUser = function(userInfo){
        var signupOptions = {
            url: '/signup',
            params: {
                username: userInfo.username,
                password: userInfo.password,
                email: userInfo.email
            },
            method: "POST"
        }

        //sharedProps.httpReq(signupOptions).then(function(res){
            console.log('we did a sign up attempt I think!')
        //})
    }

    this.attemptLogin = function(loginInfo){
        var loginOptions = {
            url: '/login',
            params: {
                username: loginInfo.username,
                password: loginInfo.password
            },
            method: "GET"
        }

        //sharedProps.httpReq(loginOptions).then(function(res){
            console.log('we made a login attempt!')
        //})
    }
});