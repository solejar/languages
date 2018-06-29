//this factory is responsible for modifying a user's card collection
angular.module('lang').factory('account',function(sharedProps,$q,$http,cardFactory){

    //JSON which holds client data about the session, currently only user data
    let session = {}; //we might want this to be a const
    const obj = {};

    const defaultSettings = {
        'maxNewCards': {
            'value': 20,
            'type': 'select',
            'choices': [
                {'value': 10, 'display': 10},
                {'value': 20, 'display': 20},
                {'value': 40, 'display': 40},
                {'value': 60, 'display': 60},
                {'value': 80, 'display': 80},
                {'value': 100, 'display': 100}
            ],
            'description': 'Max new cards per day'
        },
        'maxLearningStage': {
            'value': 2,
            'type': 'select',
            'choices': [
                {'value': 1, 'display': 1},
                {'value': 2, 'display': 2},
                {'value': 3, 'display': 3},
                {'value': 4, 'display': 4},
                {'value': 5, 'display': 5}
            ],
            'description': 'Total learning steps'
        },
        'firstLearningStep': {
            'value': 1,
            'type': 'select',
            'choices': [
                {'value': 1, 'display': 1},
                {'value': 5, 'display': 5},
                {'value': 10, 'display': 10},
                {'value': 15, 'display': 15},
                {'value': 20, 'display': 20}
            ],
            'description': 'Initial learning interval (mins)'
        },
        'initialInterval': {
            'value': 1440,
            'type': 'select',
            'choices': [
                {'value': 1440, 'display': 1},
                {'value': 1440*2, 'display': 2},
                {'value': 1440*4, 'display': 4},
                {'value': 1440*7, 'display': 7},
                {'value': 1440*14, 'display': 14}
            ],
            'description': 'Initial review interval (days)'
        },
        'initialEaseFactor': {
            'value': 2.5,
            'type': 'range',
            'options': {
                'floor': 1.3,
                'ceil': 3.5,
                'step': 0.2,
                'precision': 1,
                'onEnd': function(){
                    profile.settingsChanged=true;
                }
            },
            'description': 'Initial card ease factor'
        },
        'intervalModifier': {
            'value': 1,
            'type': 'range',
            'options': {
                'floor': 1.0,
                'ceil': 5.0,
                'step': 0.2,
                'precision': 1
            },
            'description': 'Factor by which to lengthen intervals'
        },
        'failurePenalty': {
            'value': 0.0,
            'type': 'range',
            'options': {
                'floor': 0.0,
                'ceil': 1.0,
                'step': 0.1,
                'precision': 1
            },
            'description': 'Leniency on failure'
        },
        //look into the angular slider package
        'easyBonus': {
            'value': 1.3,
            'type': 'range',
            'options': {
                'floor': 1.0,
                'ceil': 2.0,
                'step': 0.1,
                'precision': 1
            },
            'description': 'Bonus for marking card \'easy\''
        }

    };

    //remove authorization header, clear out session object
    obj.logout = function(){
        session = {};
        $http.defaults.headers.common.Authorization = '';
        sharedProps.setProperty('currPage','login');
    };

    //gets a user's setting, if doesn't exist, use default
    obj.getSetting = function(setting){

        if(session.user.settings[setting]){
            return session.user.settings[setting].value;
        }else{
            console.log('user doesnt have the setting: ' ,setting,' using system default');
            return defaultSettings[setting].value;
        }
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

    //attempts to login a user
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

    //getters/setters for current user
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

    //edit a given users info
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
                console.log(result);
            }else if(result.statusCode=='400'){
                //something went wrong
                console.log('something went wrong when editing the user');
            }
            deferred.resolve(result.content);
        });
        return deferred.promise;
    };

    //attempt to register a user
    obj.register = function(signupInfo, useDefaultSettings = true){
        const deferred = $q.defer();

        if(useDefaultSettings){
            signupInfo.settings = defaultSettings;
        }

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
