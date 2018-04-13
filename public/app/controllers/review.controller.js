angular.module('lang').controller('reviewCtrl',function(account,sharedProps, review, cardFactory){

    //array of answer options for card reviewing
    this.learningChoices = ['again','good','easy'];
    this.reviewChoices = ['again','hard','good','easy'];

    this.currReviewIndex = 0;//signals that you must show top of array

    this.cards = [];
    this.learningCount = 0;
    this.reviewCount = 0;
    this.relearningCount = 0;

    this.init = function(){
        this.loadCards();
        this.learningCount = cardFactory.countCards('learning');
        this.reviewCount = cardFactory.countCards('review');
        this.relearningCount = cardFactory.countCards('relearning');
    };

    this.enableChoicesDisplay = function(card, choicesType){
        let enableBool = false;
        console.log(card);
        let stage = card.stage;
        if(choicesType=='learning'){
            if(stage=='learning'||stage=='relearning'){
                enableBool = true;
            }
        }else if(choicesType=='review'){
            if(stage=='review'){
                enableBool = true;
            }
        }
        console.log('for stage: ',stage, ' and choicesType: ', choicesType, 'enableBool is: ',enableBool);
        return enableBool;
    };

    //function called when user answers a card
    this.submitChoice = function(card, answer){
        if(card.stage=='learning'||card.stage=='relearning'){
            review.learnCard(card,answer);
        }else if(card.stage=='review'){
            review.reviewCard(card,answer);
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
