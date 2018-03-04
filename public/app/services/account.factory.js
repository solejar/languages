var app = angular.module('lang')

//this factory is responsible for modifying a user's card collection
app.factory('account',function(sharedProps,$q,$http){

    var session = {}
    var obj = {}

    obj.logout = function(){
        session = {}
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

        var registerOptions = {
            url: '/users/',
            data: signupInfo,
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
            console.log('theres a user logged in');

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
                    session.cards = res.content;

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

    //WIP
    obj.removeCard= function(card){

        let data = {
            _id: card._id
        }

        var options = {
          url: '/users/cards',
          method: 'DELETE',
          verbose: true,
          data: data
        }

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!')
                deferred.resolve(result)
            }else{
                console.log('not successful in removing the card from the user') //technically something should resolve here i'm just doing this for testing
            }

        })
    }

    //WIP
    obj.addCard = function(card){
        let deferred = $q.defer();

        var user = obj.getUser();

        let data = {
            userid: user._id,
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
