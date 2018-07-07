angular.module('lang').controller('reviewCtrl',function(account,sharedProps, review, cardFactory){

    //array of answer options for card reviewing
    //contains word description of answer
    //and an object which represents what the card will look like if that answer is chosen
    this.choices = {
        'learning': [
            {
                description: 'again',
                resultingCard: {}
            },
            {
                description: 'good',
                resultingCard: {}
            },
            {
                description: 'easy',
                resultingCard: {}
            }
        ],
        'relearning': [
            {
                description: 'again',
                resultingCard: {}
            },
            {
                description: 'good',
                resultingCard: {}
            }
        ],
        'review': [
            {
                description: 'again',
                resultingCard: {}
            },
            {
                description: 'hard',
                resultingCard: {}
            },
            {
                description: 'good',
                resultingCard: {}
            },
            {
                description: 'easy',
                resultingCard: {}
            }
        ]
    };

    //card currently being shown for review
    this.currCard = {};

    //review deck. eventually plan to expand to multiple decks
    this.deck = [];

    this.endOfDay = new Date();
    this.reviewDone = false;

    //this is the count for each card that belongs to these categories
    this.counts = {
        learning: 0,
        review: 0,
        relearning: 0
    };

    this.init = function(){
        this.maxNewCards = account.getSetting('maxNewCards');
        review.loadSettings();
        this.loadCards();
        this.loadNextCard();
        //this timing should eventually be a setting as well
        this.endOfDay.setHours(23,59,59,999);

    };

    //collects the relevant deck
    //in the future, would like to make this accept a deck name and load the cards from that deck
    this.loadCards = function(){

        //load as many cards as the learning limit allows
        let learningCards = cardFactory.getCardsByStage('learning',true);

        if(this.maxNewCards && (this.maxNewCards<learningCards.length)){
            learningCards = learningCards.splice(0,this.maxNewCards);
        }

        //load the other cards
        let reviewCards = cardFactory.getCardsByStage('review',true);
        let relearningCards = cardFactory.getCardsByStage('relearning',true);

        this.counts.learning = learningCards.length;
        this.counts.review = reviewCards.length;
        this.counts.relearning = relearningCards.length;

        let temp = learningCards.concat(reviewCards);
        temp = temp.concat(relearningCards);

        //console.log('due cards premarkup: ', JSON.parse(JSON.stringify(temp)));
        cards = cardFactory.markupCards(temp);
        console.log('due cards postmarkup: ',JSON.parse(JSON.stringify(cards)));

        this.deck = cards;
    };

    //gets the next card, or if no new card, sets the review as being done
    this.loadNextCard = function(){
        if(this.deck.length==0){
            console.log('review done');
            this.reviewDone = true;
            return;
        }

        this.currCard = this.deck.shift(); //pop first item off the top

        let len =  this.choices[this.currCard.stage].length;

        console.log('length of choices is: ', len);
        console.log('these choices available: ', JSON.parse(JSON.stringify(this.choices[this.currCard.stage])));

        for(i=0;i<len;i++){
            let answer = this.choices[this.currCard.stage][i].description;
            let resultingCard;

            if(this.currCard.stage=='learning'||this.currCard.stage=='relearning'){
                resultingCard = review.learnCard(this.currCard,answer);
            }else if(this.currCard.stage=='review'){
                resultingCard = review.reviewCard(this.currCard,answer);
            }

            this.choices[this.currCard.stage][i].resultingCard = resultingCard;
            console.log('resulting choice object is: ',this.choices[this.currCard.stage][i]);
        }

    };

    //function called when user answers a card
    this.submitChoice = function(card, resultingCard){

        this.counts[card.stage]--;

        cardFactory.editCard(resultingCard);

        if(new Date(resultingCard.dueTime)<this.endOfDay){
            console.log('reinserting card');
            this.reinsertCard(resultingCard);
        }

        this.loadNextCard();

    };

    //if the card is still due today, add it to the queue.
    this.reinsertCard = function(updatedCard){

        let index = 0;
        let maxIndex = this.deck.length;

        //keep going until you either hit the end or find a date later than the card to be inserted
        while((index<maxIndex)){
            index++;
        }

        //and add the updated one where it belongs in order
        this.deck.splice(index,0,updatedCard);

        this.counts[updatedCard.stage]++;
    };


});
