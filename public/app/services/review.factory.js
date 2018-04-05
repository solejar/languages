angular.module('lang').factory('review',function(sharedProps,$q,cardFactory){
    const obj = {};
    const maxLearningStage = 2;
    const learningSteps = [0,1,10];

    obj.getDueCards = function(){
        let dueCards;
        let currDate = new Date();

        //filter out the due cards
        dueCards = cardFactory.getCards().filter(
            card => card.dueDate<currDate
        );

        //add markup
        dueCards = cardFactory.markupCards(dueCards);

        //shuffle them
        obj.shuffleDeck(dueCards);

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

    obj.reviewCard = function(card, answer){
        let currDate = new Date();
        let dueDate;

        if(card.type=='learning'){

            let currStage = card.learningStage;
            let newStage;

            if(answer == 'again'){
                newStage = 0;
            }else if(answer == 'good'){
                newStage = currStage + 1;
            }else if(answer == 'easy'){
                newStage = currStage+1;
            }

            if(newStage>maxLearningStage){
                card.type = 'review';
            }else{
                let timeStep = learningSteps[newStage];

                //need to multiply difference by 1000 for ms->s and 60 for s->m
                dueDate = new Date(currDate.getTime() + timeStep*60000);
            }

            card.learningStage = card.newStage;
            card.dueDate = dueDate;

        }else if(card.type=='review'){
            let easeFactor = card.easeFactor;
            let newEaseFactor;

            let dueDate;
            let currDate = new Date();

            if(answer == 'again'){

            }else if(answer == 'hard'){

            }else if(answer=='good'){

            }else if(answer=='easy'){

            }

            card.easeFactor = card.newEaseFactor;
            card.dueDate = dueDate;
        }

        card.dueDate = dueDate;
        cardFactory.editCard(card);
    };



    return obj;
});
