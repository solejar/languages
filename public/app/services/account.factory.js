//this factory is responsible for modifying a user's card collection
angular.module('lang').factory('account',function(sharedProps,$q,$http,cardFactory){

    //JSON which holds client data about the session, currently only user data
    let session = {}; //we might want this to be a const
    const obj = {};

    //remove authorization header, clear out session object
    obj.logout = function(){
        session = {};
        $http.defaults.headers.common.Authorization = '';
    };

    //WIP
    //function for a user to delete another user(s)
    //only an admin can remove a user who is not themselves
    obj.removeUser = function(user){
        const deferred = $q.defer();

        let data = {
            _id: user._id
        };

        let options = {
            url: '/users',
            method: 'DELETE',
            verbose: true,
            data: data
        };

        sharedProps.httpReq(options).then(function(result){
            deferred.resolve(result);
        });
        return deferred.promise;
    };

    obj.login = function(loginInfo){
        const deferred = $q.defer();

        let loginOptions = {
            url: '/users/login',
            data: loginInfo,
            method: 'POST',
            verbose: true,
        };

        sharedProps.httpReq(loginOptions).then(function(res){

            if(res.statusCode=='200'){
                //console.log('logged in fine')
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
                cardFactory.loadCards(session.user).then(function(cardLoadResponse){
                    if(cardLoadResponse.statusCode=='200'){
                        console.log('user card info retrieved, redirecting to profile');
                        deferred.resolve(res);
                    }
                });

            }


        });

        return deferred.promise;
    };

    //function to set the password of a user to a random string, then email them that password
    obj.resetPassword = function(email){
        const deferred = $q.defer();

        let params = {
            email: email
        };

        obj.getAccount(params).then(function(users){
            let user = users[0];
            if(user){
                //random number in base36 -> to string
                let pwd = (Math.random() + 1).toString(36).slice(2,10);

                let newUserInfo = {
                    password: pwd
                };

                console.log(user);
                obj.editUser(user._id,newUserInfo).then(function(){
                    let options = {
                        url : '/emails/passwords',
                        method : 'POST',
                        data: {
                            to: user.email,
                            password: pwd,
                            userName: user.userName
                        },
                        verbose: true
                    };

                    //console.log(options)
                    sharedProps.httpReq(options).then(function(res){
                        //console.log(res)
                        deferred.resolve(res);
                    });
                });

            }else{
                deferred.resolve('');
                console.log('no user with that e-mail found, how to show them?');
            }

        });

        return deferred.promise;
    };

    obj.setToken = function(newToken){
        if(newToken){
            $http.defaults.headers.common.Authorization = 'JWT ' + newToken;
        }

        session.token = newToken; //technically no need to store it here, but just in case
    };

    obj.getUser = function(){
        if(session.user){
            return session.user;
        }else{
            return {};
        }
    };

    obj.setUser = function(newUser){
        session.user = newUser;
    };

    obj.getAccount = function(query){

        const deferred = $q.defer();

        let options = {
            url : '/users',
            params: query,
            method: 'GET',
            verbose: true,
        };

        sharedProps.httpReq(options).then(function(res){
            let users;
            if(res.statusCode=='200'){//search worked
                users = res.content;
            }else{ //some error
                users = {};
                console.log('some error happened when checking for account availability');
            }
            deferred.resolve(users);
        });

        return deferred.promise;
    };

    obj.editUser = function(userID,newUserInfo){

        const deferred = $q.defer();

        let options = {
            url: '/users',
            data: {
                _id: userID,
                newUserInfo: newUserInfo
            },
            method: 'PUT'
        };

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                //everything went well
            }else if(result.statusCode=='400'){
                //something went wrong
                console.log('something went wrong when editing the user');
            }
            deferred.resolve(result.content);
        });
        return deferred.promise;
    };

    obj.register = function(signupInfo){
        const deferred = $q.defer();

        console.log(signupInfo);

        let registerOptions = {
            url: '/users',
            data: signupInfo,
            method: 'POST'
        };

        sharedProps.httpReq(registerOptions).then(function(res){
            console.log(res);
            if(res.statusCode=='200'){
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
            }
            deferred.resolve(res);
        });

        return deferred.promise;

    };



    return obj;
});
