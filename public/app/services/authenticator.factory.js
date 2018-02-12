var app = angular.module('lang')

app.factory('auth',function(sharedProps,$q){

    var obj = {}

    obj.attemptLogin = function(loginInfo){
        var deferred = $q.defer()

        var loginOptions = {
            url: '/login',
            data: loginInfo,
            method: 'POST'
        }

        sharedProps.httpReq(loginOptions).then(function(res){
            deferred.resolve(res)
        })

        return deferred.promise
    }

    obj.register = function(signupInfo){

        var deferred = $q.defer()

        var registerOptions = {
            url: '/signup',
            data: signupInfo,
            method: 'POST'
        }

        sharedProps.httpReq(registerOptions).then(function(res){
            deferred.resolve(res)
        })

        return deferred.promise

    }

    return obj
});