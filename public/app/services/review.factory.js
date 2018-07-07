angular.module('lang').factory('review',function(sharedProps,$q,cardFactory, account){
    const obj = {};

    //if this works, remove it from the other functions
    let initialLearningInterval;
    let maxLearningStage;
    let initialReviewInterval;
    let initialEaseFactor;
    let easyBonus;
    let intervalModifier;
    //let failurePenalty;

    //load all of the new settings when appropriate
    obj.loadSettings = function(){
        initialLearningInterval = account.getSetting('initialLearningInterval');
        maxLearningStage = account.getSetting('maxLearningStage');
        initialReviewInterval = account.getSetting('initialReviewInterval');
        initialEaseFactor = account.getSetting('initialEaseFactor');
        easyBonus = account.getSetting('easyBonus');
        intervalModifier = account.getSetting('intervalModifier');
        //failurePenalty = account.getSetting('failurePenalty');
    };

    //move a card through the review stage
    //returns a card with adjusted values based on given answer
    obj.reviewCard = function(card, answer){

        let newCard = JSON.parse(JSON.stringify(card));

        console.log('about to review a card, with answer: ', answer);

        //get the current ease and review interval
        let easeFactor = card.easeFactor;
        let newEaseFactor;

        let currInterval = card.reviewInterval;
        let newInterval;

        //and adjust them based on the answer given
        if(answer == 'again'){

            newEaseFactor = easeFactor - 0.2; //makes card appear more frequently
            /*newInterval = failurePenalty*currInterval; //defaults to 0
            if(newInterval<initialReviewInterval){
                newInterval = initialReviewInterval; //one is the default number of days, if interval was set to 0
            }*/
            newInterval = initialLearningInterval;

            //change the card stage to reflect
            newCard.stage = 'relearning';
            newCard.learningStage = 0;

        }else{
            if(answer == 'hard'){

            newEaseFactor = easeFactor - 0.15;
            newInterval = currInterval*1.2;

            }else if(answer=='good'){
                newEaseFactor = easeFactor;
                newInterval = currInterval * newEaseFactor;

            }else if(answer=='easy'){

                newEaseFactor = easeFactor + 0.15;
                newInterval = currInterval*easyBonus*newEaseFactor; //gives an added boost to easy cards

            }

            //per Anki docs, new interval is always at least one day more than currInterval
            if(newInterval<(currInterval+1440)){
                newInterval = currInterval + 1440;
            }
        }

        if(1.3>newEaseFactor){
            newEaseFactor = 1.3;
        }

        newInterval = newInterval*intervalModifier;

        newCard.reviewInterval = Math.ceil(newInterval);
        newCard.easeFactor = newEaseFactor;

        if(newCard.stage=='relearning'){ //this means you messed up the review
            newCard.dueTime = new Date();
        }else{
            let dueTime;
            //based on the new interval, calculate the next time the card will be seen
            dueTime = obj.calculateDueTime(newCard.reviewInterval);
            newCard.dueTime = dueTime;
        }

        newCard.howWellKnown = obj.calculateHowWellKnown(newCard.dueTime);

        console.log('resulting card for review should be: ', newCard);
        return newCard;
    };

    //progress a card through its learning stage, based on your answer too it.
    //returns a card, with the adjusted values
    obj.learnCard = function(card,answer){

        let newCard = JSON.parse(JSON.stringify(card));

        let currReviewInterval = card.reviewInterval;
        let newReviewInterval;

        let dueTime;

        let currStage = card.learningStage;
        let newStage;

        //increment up learning stages with response
        if(answer == 'again'){
            newStage = 1;
            newReviewInterval = initialLearningInterval;
        }else if(answer == 'good'){
            newStage = currStage + 1;
            newReviewInterval = currReviewInterval*10;

        }else if(answer == 'easy'){
            newStage = maxLearningStage+1; //automatically graduate
            newReviewInterval = currReviewInterval*100;
        }

        //if your response would take you past the total number of learning stages,
        //it becomes a review card

        if(newStage>maxLearningStage){

            if(card.stage=='learning'){ //if it was a relearning card, it already has these values, and we don't need them

                newCard.reviewInterval = Math.ceil(initialReviewInterval);
                newCard.easeFactor = initialEaseFactor;

                dueTime = obj.calculateDueTime(newCard.reviewInterval);
                newCard.howWellKnown = obj.calculateHowWellKnown(dueTime);

                newCard.dueTime = dueTime;
            }

            newCard.stage = 'review';
            newCard.learningStage = maxLearningStage+1; //this isn't really necessary

        }else{

            newCard.reviewInterval = Math.ceil(newReviewInterval);
            newCard.learningStage = newStage;
            dueTime = obj.calculateDueTime(newCard.reviewInterval);

            newCard.dueTime = dueTime;

        }

        return newCard;

    };

    //Comes up with numeric ranking from 1-4 which represents how well you know the word
    //1 representing not very well, 4 representing quite well
    obj.calculateHowWellKnown = function(cardDueTime){
        let ranking;

        let currTime = new Date();
        let timeDiffDays =  (cardDueTime-currTime)/(24*60*60*1000);

        //this is kind of arbitrary
        if(timeDiffDays<7){
            ranking = 1;
        }else if(timeDiffDays<31){
            ranking = 2;
        }else if(timeDiffDays<62){
            ranking = 3;
        }else{
            ranking = 4;
        }

        return ranking;
    };

    const minuteModifier = 60000; //amount of milliseconds in a minute, for date adjusting

    //plus minus range for random fuzz added to review interval
    const largeFuzzRange = 15;
    const smallFuzzRange = 1;

    //put it in minutes
    const largeFuzzRangeMinutes = largeFuzzRange*minuteModifier;
    const smallFuzzRangeMinutes = smallFuzzRange*minuteModifier;

    //this interval is always coming in as minutes
    obj.calculateDueTime = function(interval){
        let currDate = new Date();

        let baseTime = interval*minuteModifier;

        //if intervals are larger than a day
        let fuzz;
        if(interval>1440){
            fuzz = largeFuzzRangeMinutes*(Math.random()-0.5);
        }else{
            fuzz = smallFuzzRangeMinutes*(Math.random()-0.5);
        }

        baseTime += fuzz;

        let newdueTime = new Date(currDate.getTime() + baseTime);

        return newdueTime;
    };

    return obj;
});
