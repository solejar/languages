angular.module('lang').controller('reviewCtrl',function(account,sharedProps, review, cardFactory){

    //array of answer options for card reviewing
    this.learningChoices = ['again','good','easy'];
    this.reviewChoices = ['again','hard','good','easy'];
    this.relearningChoices = ['again','good'];

    this.currReviewIndex = 0;//signals that you must show top of array


    this.cards = [];
    this.counts = {
        learning: 0,
        review: 0,
        relearning: 0
    };

    this.init = function(){
        this.loadCards();
        this.counts.learning = cardFactory.countCards('learning');
        this.counts.review = cardFactory.countCards('review');
        this.counts.relearning = cardFactory.countCards('relearning');
        this.maxNewCards = account.getSetting('maxNewCards');
    };

    //function called when user answers a card
    this.submitChoice = function(card, answer,oldIndex){
        let updatedCard;
        if(card.stage=='learning'){
            updatedCard = review.learnCard(card,answer);
            if(updatedCard.stage=='review'){
                this.counts.learning--;
            }

        }else if(card.stage=='review'){
            updatedCard = review.reviewCard(card,answer);
            if(answer=='again'){
                this.counts.relearning++;
            }
            this.counts.review--;
        }else if(card.stage=='relearning'){
            updatedCard = review.learnCard(card,answer);
            if(updatedCard.stage=='review'){
                this.counts.review--;
            }
        }

        if(updatedCard.stage=='learning'||updatedCard.stage=='relearning'){
            //all failed cards need to be reinserted.
            //all learning cards keep getting reinserted.
            this.reinsertCard(updatedCard,oldIndex);
        }

        this.currReviewIndex++;
    };

    //sometimes
    this.reinsertCard = function(updatedCard,oldIndex){
        //get rid of the old version of the card in the local list
        //console.log('presumably old card is ',this.cards[oldIndex]);
        //console.log('card attempting to add is ',updatedCard);
        this.cards.splice(oldIndex,1);

        let index = 0;
        let newDueDate = updatedCard.dueTime;
        while(this.cards[index].dueTime-newDueDate>0){
            index++;
        }

        //and add the updated one where it belongs in order
        this.cards.splice(index++,0,updatedCard);
    };

    //called on startup
    this.loadCards = function(){
        let cards = cardFactory.getDueCards();
        cards = cardFactory.markupCards(cards);
        console.log(cards);
        this.cards = cards;
    };
});
