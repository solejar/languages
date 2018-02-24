var app = angular.module('lang')

//this factory is responsible for modifying a user's card collection
app.factory('account',function(auth,sharedProps){
    //var session = {}

    var obj = {}

    obj.removeCard= function(card){
        var user = auth.getUser();
        var token = auth.getToken();

        var options = {}
        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!')
            }else{
                console.log('not succesffully in removing the card from the user')
            }
        })
    }

    obj.addCard = function(card){
        var user = auth.getUser();
        var token = auth.getToken();

        var options =
        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully removed the card from the user!')
            }else{
                console.log('not succesffully in removing the card from the user')
            }
        })
    }

    obj.editCard = function(card){
        var user = auth.getUser();
        var token = auth.getToken();

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

    obj.markCard = function(card){

        var user = auth.getUser();
        var token = auth.getToken();

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

    obj.initCards = function(){
        var deferred = $q.defer();
        var user = obj.getUser();

        var cardOptions = {
            url: '/users/cards/',
            method: 'GET',
            user: user,
            verbose: true
        }

        sharedProps.httpReq(cardOptions).then(function(res){
          if(res.statusCode=='200'){
            obj.setCards(res.content);
          }
          deferred.resolve(res)
        })
    }

    return obj
})
