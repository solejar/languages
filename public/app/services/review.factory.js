angular.module('lang').factory('review',function(sharedProps,$q,cardFactory){
    const obj = {};

    //how to connect all of these to user account?
    const maxLearningStage = 2; //0 is first stage, so 3 total stages here
    const learningSteps = [0,1,10];
    const initialInterval = 1; //1 day is default interval
    const initialEaseFactor = 2.5;
    const easyBonus = 1.3;
    const intervalModifier = 1;
    const failurePenalty = 0;

    obj.reviewCard = function(card, answer){
        console.log('about to review a card, with answer: ', answer);

        let dueDate;

        if(card.stage=='learning'||card.stage=='relearning'){

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
                if(card.stage=='learning'){ //if it was a relearning card, it already has these values
                    card.reviewInterval = initialInterval;
                    card.easeFactor = initialEaseFactor; //this is the default

                    dueDate = obj.calculateDueDate(card.reviewInterval,'day');
                }

                card.stage = 'review';

            }else{

                let timeStep = learningSteps[newStage];
                dueDate = obj.calculateDueDate(timeStep,'minute');

            }

            card.learningStage = card.newStage;
            card.dueTime = dueDate;

        }else if(card.stage=='review'){
            let easeFactor = card.easeFactor;
            let newEaseFactor;

            let currInterval = card.reviewInterval;
            let newInterval;

            if(answer == 'again'){
                newEaseFactor = easeFactor - 0.2;
                newInterval = failurePenalty*currInterval;

                card.stage = 'relearning';
                card.learningStage = 0;

            }else if(answer == 'hard'){

                newEaseFactor = easeFactor - 0.15;
                if(1.3>newEaseFactor){
                    newEaseFactor = 1.3;
                }
                newInterval = currInterval*1.2;
            }else if(answer=='good'){
                newEaseFactor = easeFactor;
                newInterval = currInterval * newEaseFactor;
            }else if(answer=='easy'){
                newEaseFactor = easeFactor + 0.15;
                newInterval = currInterval*easyBonus*newEaseFactor;
            }

            newInterval = newInterval*intervalModifier;
            //per Anki docs, new interval is always at least one day more than currInterval
            if(newInterval<(currInterval+1)){
                newInterval = currInterval + 1;
            }

            let newDueDate = obj.calculateDueDate(newInterval, 'day');

            card.reviewInterval = newInterval;
            card.easeFactor = newEaseFactor;

            if(card.stage=='relearning'){
                card.dueTime = new Date();
            }else{
                card.dueTime = newDueDate;
            }
        }

        cardFactory.editCard(card);
    };

    const secondModifier = 1000;
    const minuteModifier = 60*secondModifier;
    const hourModifier = minuteModifier*60;
    const dayModifier = hourModifier*24;

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

        let newDueDate = new Date(currDate.getTime() + interval*modifier);

        return newDueDate;
    };



    return obj;
});