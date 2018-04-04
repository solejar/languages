angular.module('lang').factory('cardFactory',function(sharedProps,$q){
    const obj = {};
    let cards = [];

    obj.getCards = function(){
        //console.log('')
        if(cards){
            //console.log('yes, there are cards');

            return cards;
        }else{
            return [];
        }

    };

    obj.loadCards = function(user){
        const deferred = $q.defer();

        if(user){
            //console.log('theres a user logged in: ',user);

            let cardOptions = {
                url: '/users/cards/',
                method: 'GET',
                verbose: true,
                params: {
                  user_id: user._id
                }
            };

            sharedProps.httpReq(cardOptions).then(function(res){
                if(res.statusCode=='200'){
                    cards = res.content;
                    console.log(cards);
                }else{
                    console.log('something went horribly wrong with fetching the cards!');
                }

                deferred.resolve(res);
            });

        }else{
            console.log('trying to get cards for nobody!');
            deferred.resolve([]);
        }

        return deferred.promise;


    };

    obj.removeCard= function(card){
        const deferred = $q.defer();

        console.log(card);

        let data = {
            _id: card._id
        };

        let options = {
          url: '/users/cards',
          method: 'DELETE',
          verbose: true,
          data: data
        };

        console.log(options.data);

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                for(let i = 0;i<cards.length;i++){
                    if (cards[i]._id == data._id){
                        cards.splice(i,1);
                        deferred.resolve(result);
                    }
                }
                console.log('successfully removed the card from the user!');
            }else{
                console.log('not successful in removing the card from the user'); //technically something should resolve here i'm just doing this for testing
            }

            deferred.resolve(result);

        });

        return deferred.promise;
    };

    obj.addCard = function(card,user){
        const deferred = $q.defer();

        let data = {
            user_id: user._id,
            front: card.front,
            back: card.back,
            meta: card.meta,
            starred: card.starred
        };

        let options = {
          url: '/users/cards/',
          method: 'POST',
          data: data,
          verbose: true
        };

        sharedProps.httpReq(options).then(function(result){
            console.log('finished posting a card!');
            if(result.statusCode=='200'){
                cards.push(data);
                console.log('successfully added the card to the user!');
            }else{
                console.log('not successful in adding the card to the user');
            }
            deferred.resolve(result);
        });

        return deferred.promise;
    };

    //WIP
    obj.pruneID = function(card){
        let prunedCard = {
            front: card.front,
            back: card.back,
            meta: card.meta,
            starred: card.starred
        };

        return prunedCard;
    };

    obj.editCard = function(card){

        const deferred = $q.defer();

        let options = {
            url: '/users/cards',
            data: {
                card: obj.pruneID(card),
                card_id: card._id
            },
            method: 'PUT'
        };

        console.log(options);

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('successfully edited the card');
                deferred.resolve({statusCode: '200',message: 'Edit was succesful'});
            }else{
                console.log('not succesful in editing the card from the user');
                deferred.resolve({statusCode: '400',message: 'edit was unsuccessful'});
            }
        });

        return deferred.promise;
    };

    return obj;
});
