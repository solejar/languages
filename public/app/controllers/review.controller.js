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
    };

    //function called when user answers a card
    this.submitChoice = function(card, answer){
        if(card.stage=='learning'){
            let graduated = review.learnCard(card,answer);
            if(graduated){
                this.counts.learning--;
            }

        }else if(card.stage=='review'){
            review.reviewCard(card,answer);
            if(answer=='again'){
                this.counts.relearning++;
            }
            this.counts.review--;
        }else if(card.stage=='relearning'){
            let graduated = review.learnCard(card,answer);
            if(graduated){
                this.counts.review--;
            }
        }

        this.currReviewIndex++;
    };

    //called on startup
    this.loadCards = function(){
        let cards = cardFactory.getDueCards();
        cards = cardFactory.markupCards(cards);
        console.log(cards);
        this.cards = cards;
    };
});
