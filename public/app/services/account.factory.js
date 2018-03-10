//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

//this factory is responsible for modifying a user's card collection
app.factory('account',function(sharedProps,$q,$http){

    var session = {}
    var obj = {}

    obj.logout = function(){
        session = {}
        $http.defaults.headers.common['Authorization'] = '';
    }

    //WIP
    obj.removeUser = function(user){
        let deferred = $q.defer();

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
        let deferred = $q.defer();

        var loginOptions = {
            url: '/users/login',
            data: loginInfo,
            method: 'POST',
            verbose: true,
        }

        sharedProps.httpReq(loginOptions).then(function(res){
            if(res.statusCode=='200'){
                //console.log('logged in fine')
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
                //obj.setAuthHeader();
                obj.loadCards()

            }
            deferred.resolve(res)

        })

        return deferred.promise
    }

    obj.resetPassword = function(email){
        let deferred = $q.defer();

        let params = {
            email: email
        }
        obj.getAccount(params).then(function(user){

            if(user){
                let pwd = '1234'; //make this randomly generate somehow

                user.password = pwd;

                obj.editUser(user);

                let options = {
                    url : '/emails/passwords',
                    method : 'POST',
                    data: {
                        to: user.email,
                        pwd: pwd,
                        userName: user.userName
                    },
                    verbose: true
                }

                sharedProps.httpReq(options).then(function(res){
                    console.log(res)
                    deferred.resolve(res)
                })
            }else{
                console.log('no user with that e-mail found, how to show them?');
            }

        })

        return deferred.promise;
    }

    obj.setToken = function(newToken){
        //console.log('setting new token',newToken)
        if(newToken){
            $http.defaults.headers.common['Authorization'] = 'JWT ' + newToken
        }

        session.token = newToken; //technically no need to store it here, but just in case
    }

    obj.getUser = function(){
        return session.user;
    }

    obj.setUser = function(newUser){
        //console.log('setting new user',newUser)
        session.user = newUser;
    }

    obj.getAccount = function(q){
    //obj.checkAccountAvailability = function(entityName,type){
        let deferred = $q.defer();

        //let params = {};
        //params[type] = entityName;

        let options = {
            url : '/users',
            params: q,
            method: 'GET',
            verbose: true,
        }

        sharedProps.httpReq(options).then(function(res){
            let user;
            if(res.statusCode=='200'){//search worked
                if(res.content[0]){//user exists
                    console.log('account already exists');
                    //userAvailable = false;
                    user = res.content[0]
                }else{//account available
                    console.log('account is available');
                    //userAvailable = true;
                    user = {}
                }
            }else{ //some error
                //userAvailable = false; //if some error happens, don't assume name available
                user = {}
                console.log('some error happened when checking for account availability');
            }
            deferred.resolve(user);
        })

        return deferred.promise;
    }
    //WIP
    //need to pass in user ID as query param, need to add auto-incrementing ID before this works
    obj.editUser = function(userInfo){
        //idk how to do this

        var options = {
            url: '/users/',
            data: userInfo,
            method: 'PUT'
        }

        sharedProps.httpReq(options).then(function(result){
            return result
        })
    }

    obj.register = function(signupInfo){
        let deferred = $q.defer();

        console.log(signupInfo);

        var registerOptions = {
            url: '/users',
            data: signupInfo,
            method: 'POST'
        }

        sharedProps.httpReq(registerOptions).then(function(res){
            console.log(res)
            if(res.statusCode=='200'){
                obj.setUser(res.content.user);
                obj.setToken(res.content.token);
            }
            deferred.resolve(res)
        })

        return deferred.promise

    }

    obj.getCards = function(){
        let cards = session.cards;
        if(cards){
            return cards;
        }else{
            return [];
        }

    }

    obj.loadCards = function(){
        let deferred = $q.defer();

        var user = obj.getUser();

        console.log('getting cards');
        if(user){
            console.log('theres a user logged in: ',user);

            var cardOptions = {
                url: '/users/cards/',
                method: 'GET',
                verbose: true,
                params: {
                  user_id: user._id
                }
            }

            sharedProps.httpReq(cardOptions).then(function(res){
                if(res.statusCode=='200'){
                    session.cards = res.content;

                    //console.log(res)
                    console.log(session.cards)
                }else{
                    console.log('something went horribly wrong with fetching the cards!');
                }

                deferred.resolve(res)
            })

        }else{
            console.log('trying to get cards for nobody!');
            deferred.resolve([])
        }

        return deferred.promise;


    }

    obj.removeCard= function(card){
        let deferred = $q.defer();

        console.log(card);

        let data = {
            _id: card._id
        }

        var options = {
          url: '/users/cards',
          method: 'DELETE',
          verbose: true,
          data: data
        }

        console.log(options.data)

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!');
            }else{
                console.log('not successful in removing the card from the user') //technically something should resolve here i'm just doing this for testing
            }

            deferred.resolve(result)

        })

        return deferred.promise;
    }

    //WIP
    obj.addCard = function(card){
        let deferred = $q.defer();

        var user = obj.getUser();

        let data = {
            user_id: user._id,
            content: card.content,
            meta: card.meta
        }

        var options = {
          url: '/users/cards/',
          method: 'POST',
          data: data,
          verbose: true
        }

        sharedProps.httpReq(options).then(function(result){
            console.log('finished posting a card!')
            if(result.statusCode=='200'){
                console.log('successfully added the card to the user!')
            }else{
                console.log('not successful in adding the card to the user')
            }
            deferred.resolve(result);
        })

        return deferred.promise;
    }

    //WIP
    obj.editCard = function(card){
        var user = obj.getUser();

        var options = {

        }
        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!')
            }else{
                console.log('not succesffully in removing the card from the user')
            }
        })

        if(card.saved){
            //edit the card
            return 2;
        }else{
            //add the word
            return 3;
        }
    }

    //WIP
    obj.markCard = function(card){

        var user = obj.getUser();

        var options =
        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!')
            }else{
                console.log('not succesffully in removing the card from the user')
            }
        })

        card.marked= !card.marked

        obj.editCard(card,user)

        return 4;
    }


    return obj
})
