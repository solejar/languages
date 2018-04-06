angular.module('lang').controller('reviewCtrl',function(account,sharedProps, review, cardFactory){

    //array of answer options for card reviewing
    this.learningChoices = ['again','good','easy'];
    this.reviewChoices = ['again','hard','good','easy'];

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

    //function called when user answers a card
    this.submitChoice = function(card, answer){
        review.reviewCard(card,answer);
    };

    //called on startup
    this.loadCards = function(){
        let cards = cardFactory.getDueCards();
        cards = cardFactory.markupCards(cards);
        console.log(cards);
        this.cards = cards;
    };
});
