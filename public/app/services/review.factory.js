angular.module('lang').factory('review',function(sharedProps,$q,cardFactory){
    const obj = {};

    //how to connect all of these to user account?
    const maxLearningStage = 1; //0 is first stage, so 2 total stages here
    const learningSteps = [1,10];
    const initialInterval = 1; //1 day is default interval
    const initialEaseFactor = 2.5;
    const easyBonus = 1.3;
    const intervalModifier = 1;
    const failurePenalty = 0;

    obj.reviewCard = function(card, answer){
        console.log('about to review a card, with answer: ', answer);

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
                newInterval = 1; //one is the default number of days, if interval was set to 0
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

        //encapsulate the new interval into a different function so that we can use it to display as a preview on the front
        //this can probably be worked around better
        newInterval = newInterval*intervalModifier;
        //per Anki docs, new interval is always at least one day more than currInterval
        if(newInterval<(currInterval+1)){
            newInterval = currInterval + 1;
        }

        let dueDate;

        dueDate = obj.calculateDueDate(newInterval, 'day');

        card.reviewInterval = newInterval;
        card.easeFactor = newEaseFactor;

        if(card.stage=='relearning'){ //this means you messed up the review
            card.dueTime = new Date();
        }else{
            card.dueTime = dueDate;
        }

        card.difficulty = obj.calculateRanking(card.dueTime);

        //cardFactory.editCard(card);
        return card;
    };

    obj.learnCard = function(card,answer){

        let dueDate;

        let currStage = card.learningStage;
        let newStage;

        //increment up learning stages with response
        if(answer == 'again'){
            newStage = 0;
        }else if(answer == 'good'){
            newStage = currStage + 1;
        }else if(answer == 'easy'){
            newStage = maxLearningStage+1; //automatically graduate
        }

        //if your response would take you past the total number of learning stages,
        //it becomes a review card

        if(newStage>maxLearningStage){

            if(card.stage=='learning'){ //if it was a relearning card, it already has these values, and we don't need them
                card.reviewInterval = initialInterval;
                card.easeFactor = initialEaseFactor;

                dueDate = obj.calculateDueDate(card.reviewInterval,'day');
                card.difficulty = obj.calculateRanking(card.dueTime);
            }

            card.stage = 'review';
            card.learningStage = maxLearningStage+1; //this isn't really necessary

        }else{

            let timeStep = learningSteps[newStage];
            dueDate = obj.calculateDueDate(timeStep,'minute');

            card.learningStage = card.newStage;

        }

        card.dueTime = dueDate;

        //cardFactory.editCard(card);
        return card;

    };

    obj.calculateRanking = function(cardDueTime){
        let ranking;

        let currTime = new Date();
        let timeDiffDays =  (cardDueTime-currTime)/(24*60*60*1000);

        if(timeDiffDays<7){
            ranking = 4;
        }else if(timeDiffDays<31){
            ranking = 3;
        }else if(timeDiffDays<62){
            ranking = 2;
        }else{
            ranking = 1;
        }

        return ranking;
    };

    const secondModifier = 1000;
    const minuteModifier = 60*secondModifier;
    const hourModifier = minuteModifier*60;
    const dayModifier = hourModifier*24;

    //plus minus range for random fuzz added to review interval
    const fuzzRange = 15;

    //put it in minutes
    const fuzzRangeMinutes = fuzzRange*minuteModifier;
    obj.calculateDueDate = function(interval, unit){
        let currDate = new Date();

        let modifier;
        if(unit == 'sec'){
            modifier = secondModifier;
        }else if (unit =='minute'){
            modifier = minuteModifier;
        }else if (unit =='hour'){
            modifier = hourModifier;
        }else if( unit =='day'){
            modifier = dayModifier;
        }else{
            //just assume day
            modifier = dayModifier;
        }

        let baseTime = interval*modifier;
        if(unit!='sec'&&unit!='minute'){
            let fuzz = fuzzRangeMinutes*(Math.random()-0.5);
            baseTime += fuzz;
        }

        let newDueDate = new Date(currDate.getTime() + baseTime);

        return newDueDate;
    };



    return obj;
});
