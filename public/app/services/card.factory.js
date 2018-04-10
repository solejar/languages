angular.module('lang').factory('cardFactory',function(sharedProps,$q){
    const obj = {};
    let cards = [];

    obj.getCardsByType = function(type){

        if(!cards){
            return [];
        }

        if(!type||(type=='all')){ //assume null input to mean user wants all cards
            return cards;
        }else{
            //else only return cards of the desired types
            let filteredCards = cards.filter(card => card.type==type);
            return filteredCards;
        }


    };

    obj.getCardsByStage = function(stage){
        if(!cards){
            return [];
        }

        if(!stage||(stage=='all')){ //assume null input to mean user wants all cards
            return cards;
        }else{
            //else only return cards of the desired types
            let filteredCards = cards.filter(card => card.stage==stage);
            return filteredCards;
        }
    };

    obj.countCards = function(stage){
        let cardSubSet = obj.getCardsByStage(stage);
        console.log('for stage: ',stage,' found these cards:',cardSubSet);
        return cardSubSet.length;
    };

    obj.markupCards = function(baseCards){
        let markupCards;

        markupCards = baseCards.map(function(card){
            let cardContainer = card;
            cardContainer.markup = {
                expanded: false,
                edit: false,
                flipped: false
            };

            return cardContainer;
        });
        return markupCards;
    };

    obj.getDueCards = function(){
        let dueCards;
        let currDate = new Date();

        //filter out the due cards
        dueCards = cards.filter(
            card => (new Date(card.dueTime))<currDate
        );

        //shuffle them
        obj.shuffleDeck(dueCards);

        //console.log('cards found are:', cards);
        //console.log('date compare result: ', cards[0].dueTime<currDate);
        //console.log('currDate:',currDate);
        //console.log('dueDate:',cards[0].dueTime);
        console.log('due cards were found to be:', dueCards);
        return dueCards;
    };

    obj.shuffleDeck = function(array){
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
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

    obj.addCard = function(card,user,type){
        const deferred = $q.defer();

        let currentTime = new Date();

        let data = {
            user_id: user._id,
            front: card.front,
            back: card.back,
            learningStage: 0,
            stage: 'learning',
            starred: false,
            type: type, //did it come from declension?
            dueTime: currentTime
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
        let prunedCard = {};
        for(let property in card){
            if(property!='markup'&&property!='_id'){
                prunedCard[property] = card[property];
            }
        }
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
