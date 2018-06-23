angular.module('lang').factory('review',function(sharedProps,$q,cardFactory, account){
    const obj = {};

    //how to connect all of these to user account?

    //if this works, remove it from the other functions
    let firstLearningStep;
    let maxLearningStage;
    let initialInterval;
    let initialEaseFactor;
    let easyBonus;
    let intervalModifier;
    let failurePenalty;

    obj.loadSettings = function(){
        learningSteps = account.getSetting('learningSteps');
        maxLearningStage = account.getSetting('maxLearningStage');
        initialInterval = account.getSetting('initialInterval');
        initialEaseFactor = account.getSetting('initialEaseFactor');
        easyBonus = account.getSetting('easyBonus');
        intervalModifier = account.getSetting('intervalModifier');
        failurePenalty = account.getSetting('failurePenalty');
    };

    obj.reviewCard = function(card, answer){
        console.log('about to review a card, with answer: ', answer);

        let initialInterval = account.getSetting('initialInterval');
        let easyBonus = account.getSetting('easyBonus');
        let intervalModifier = account.getSetting('intervalModifier');
        let failurePenalty = account.getSetting('failurePenalty');

        //get the current ease and review interval
        let easeFactor = card.easeFactor;
        let newEaseFactor;

        let currInterval = card.reviewInterval;
        let newInterval;

        //and adjust them based on the answer given
        if(answer == 'again'){

            newEaseFactor = easeFactor - 0.2; //makes card appear more frequently
            newInterval = failurePenalty*currInterval; //defaults to 0
            if(!newInterval){
                newInterval = initialInterval; //one is the default number of days, if interval was set to 0
            }

            //change the card stage to reflect
            card.stage = 'relearning';
            card.learningStage = 0;

        }else if(answer == 'hard'){

            newEaseFactor = easeFactor - 0.15;
            newInterval = currInterval*1.2;

        }else if(answer=='good'){
            newEaseFactor = easeFactor;
            newInterval = currInterval * newEaseFactor;

        }else if(answer=='easy'){

            newEaseFactor = easeFactor + 0.15;
            newInterval = currInterval*easyBonus*newEaseFactor; //gives an added boost to easy cards

        }

        if(1.3>newEaseFactor){
            newEaseFactor = 1.3;
        }

        //this can probably be worked around better
        newInterval = newInterval*intervalModifier;

        //per Anki docs, new interval is always at least one day more than currInterval
        if(newInterval<(currInterval+1440)){
            newInterval = currInterval + 1440;
        }

        let dueTime;

        dueTime = obj.calculateDueTime(newInterval);

        card.reviewInterval = newInterval;
        card.easeFactor = newEaseFactor;

        if(card.stage=='relearning'){ //this means you messed up the review
            card.dueTime = new Date();
        }else{
            card.dueTime = dueTime;
        }

        card.howWellKnown = obj.calculateHowWellKnown(card.dueTime);

        return card;
    };

    obj.learnCard = function(card,answer){

        let maxLearningStage = account.getSetting('maxLearningStage');
        let initialInterval = account.getSetting('initialInterval');
        let firstLearningStep = account.getSetting('firstLearningStep');
        let initialEaseFactor = account.getSetting('initialEaseFactor');

        let currReviewInterval = card.reviewInterval;
        let newReviewInterval;

        let dueTime;

        let currStage = card.learningStage;
        let newStage;

        //increment up learning stages with response
        if(answer == 'again'){
            newStage = 1;
            newReviewInterval = firstLearningStep;
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

                card.reviewInterval = initialInterval;
                card.easeFactor = initialEaseFactor;

                dueTime = obj.calculateDueTime(card.reviewInterval);
                card.howWellKnown = obj.calculateHowWellKnown(card.dueTime);
            }

            card.stage = 'review';
            card.learningStage = maxLearningStage+1; //this isn't really necessary

        }else{

            //let timeStep = learningSteps[newStage];

            dueTime = obj.calculateDueTime(timeStep);

            card.learningStage = card.newStage;

        }

        card.dueTime = dueTime;

        return card;

    };

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
    const fuzzRange = 15;

    //put it in minutes
    const fuzzRangeMinutes = fuzzRange*minuteModifier;

    //just make this in minutes all the time
    obj.calculateDueTime = function(interval){
        let currDate = new Date();

        let baseTime = interval*modifier;
        let fuzz = fuzzRangeMinutes*(Math.random()-0.5);
        baseTime += fuzz;

        let newdueTime = new Date(currDate.getTime() + baseTime);

        return newdueTime;
    };

    return obj;
});
