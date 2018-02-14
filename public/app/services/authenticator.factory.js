var app = angular.module('lang')

app.factory('auth',function(sharedProps,$q,$http, $httpParamSerializer){

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    var session = {}

    var obj = {}

    obj.logout = function(){
        session = {}
    }

    obj.attemptLogin = function(loginInfo){
        var deferred = $q.defer()

        var data = {}
        data = loginInfo

        var qs = $httpParamSerializer(loginInfo)
        console.log(qs)
        //console.log(data)
        var loginOptions = {
            url: '/login',
            data: qs,
            method: 'POST',
            verbose: true,
        }

       /* var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('/login',{userName: loginInfo.userName, password: loginInfo.password},config)
        .then(function(data){
            obj.setUser(data.user)
            obj.setToken(data.token)
            deferred.resolve(data)
        })
        
        .finally(function(){

            console.log("finally finished logging in!");
            //deferred.resolve()
        });*/

        sharedProps.httpReq(loginOptions).then(function(res){
            if(res.statusCode=='200'){

                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
            }
            deferred.resolve(res)
        })

        return deferred.promise
    }

    obj.getToken = function(){
        return session.token;
    }

    obj.setToken = function(newToken){
        //console.log('setting new token',newToken)
        session.token = newToken;
    }

    obj.getUser = function(){
        return session.user;
    }

    obj.setUser = function(newUser){
        //console.log('setting new user',newUser)
        session.user = newUser;
    }

    obj.register = function(signupInfo){

        var deferred = $q.defer()

        var qs = $httpParamSerializer(signupInfo)
        var registerOptions = {
            url: '/signup',
            data: qs,
            method: 'POST'
        }

        sharedProps.httpReq(registerOptions).then(function(res){
            if(res.statusCode=='200'){
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
            }
            deferred.resolve(res)
        })

        return deferred.promise

    }

    return obj
});