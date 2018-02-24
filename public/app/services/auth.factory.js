var app = angular.module('lang')

app.factory('auth',function(sharedProps,$q,$http, $httpParamSerializer){

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    var session = {}

    var obj = {}

    obj.setAuthHeader = function(){
        var token = obj.getToken()
        if(token){
            $http.defaults.headers.common['Authorization'] = 'JWT ' + token
        }
    }

    obj.logout = function(){
        session = {}
    }

    obj.removeUser = function(user){
        var deferred = $q.defer()

        var params = {
            userName: user.userName,
            _id: user._id
        }

        var options = {
            url: '/users',
            method: 'DELETE',
            verbose: true,
            params: params
        }

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode =='200'){
                console.log('you successfully removed a user!')
            }else{
                console.log('user removal failed')
            }

            deferred.resolve('finished either way')
        })
        return deferred.promise
    }

    obj.attemptLogin = function(loginInfo){
        var deferred = $q.defer()

        var data = {}
        data = loginInfo

        var qs = $httpParamSerializer(loginInfo)
        //console.log(qs)
        //console.log(data)
        var loginOptions = {
            url: '/users/login',
            data: qs,
            method: 'POST',
            verbose: true,
        }

        sharedProps.httpReq(loginOptions).then(function(res){
            if(res.statusCode=='200'){

                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
                obj.setAuthHeader();
                obj.initCards()

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

    //need to pass in user ID as query param, need to add auto-incrementing ID before this works
    obj.editUser = function(userInfo){
        //idk how to do this

        var qs = $httpParamSerializer(userInfo)
        var options = {
            url: '/users/',
            data: qs,
            method: 'PUT'
        }

        sharedProps.httpReq(options).then(function(result){
            return result
        })
    }

    obj.register = function(signupInfo){

        var deferred = $q.defer()

        var qs = $httpParamSerializer(signupInfo)
        var registerOptions = {
            url: '/users/',
            data: qs,
            method: 'POST'
        }

        sharedProps.httpReq(registerOptions).then(function(res){
            if(res.statusCode=='200'){
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
                obj.setAuthHeader()
            }
            deferred.resolve(res)
        })

        return deferred.promise

    }

    obj.initCards = function(){
        var deferred = $q.defer();
        var user = obj.getUser();

        var cardOptions = {
            url: '/users/cards/',
            method: 'GET',
            verbose: true,
            params: {
              user: user
            }
        }

        sharedProps.httpReq(cardOptions).then(function(res){
          if(res.statusCode=='200'){
            obj.setCards(res.content);
          }
          deferred.resolve(res)
        })
    }

    return obj
});
