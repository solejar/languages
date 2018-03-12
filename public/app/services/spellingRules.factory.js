//this service verifies that declined words comply with Russian spelling rules
//also can determine gender of certain words
angular.module('lang').factory('spellingRules',function(){
    const obj = {};

    const softConsList = ['г','к','х','ж','ч','ш','щ','ц'];
    const adjEndingGenders = {
        'ий': 'M',
        'яя': 'F',
        'ее': 'N',
        'ой': 'M',
        'ая': 'F',
        'ый': 'M',
        'ое': 'N'
    };

    //this function checks the spellingRules
    obj.check = function(origStem, origEnding){
        //console.log(origStem + ' ' + origEnding)

        //доро+г
        let stemLen = origStem.length;
        let lastStemLetter = origStem.substring(stemLen-1,stemLen);

        //ых-> ы
        let firstEndingLetter = origEnding.substring(0,1);
        let newEnding = firstEndingLetter;

        //ых-> х
        let endingLen = origEnding.length;
        let endingRemainder = origEnding.substring(1,endingLen); //either blank or the last letter

        //console.log(lastStemLetter + ' ' + firstEndingLetter + ' ' + endingRemainder)

        if(softConsList.includes(lastStemLetter)){
            if(firstEndingLetter=='ы'){
                newEnding = 'и';
            }else if(firstEndingLetter=='я'){
                newEnding = 'а';
            }else if(firstEndingLetter=='ю'){
                newEnding = 'у';
            }else if(!(lastStemLetter=='г'||lastStemLetter=='к'||lastStemLetter=='х')&&firstEndingLetter =='о'){
                if (origEnding== 'ого'){
                    newEnding = firstEndingLetter; //don't change if stressed
                }else{
                    newEnding = 'е';
                }
            }
        }

        //дорог,ых -> их
        return newEnding+endingRemainder;
    };

    //this function gets the adj type
    obj.getAdjType = function(adj){
        let length = adj.length;
        let ending = adj.substring(length-3,length);

        let type;
        if(ending=='ний'||ending =='няя'||ending=='нее'){
            type = 'soft';
        }else{
            type = 'hard';
        }
        return type;
    };

    //this function determines the gender of generic adjectives
    obj.genericAdjGender= function(word){
        let len = word.length;
        let gender = ''; //default if gender not identified
        if(len>=2){
            let ending = word.substring(len-2,len);
            if (adjEndingGenders.hasOwnProperty(ending)){
                gender = adjEndingGenders[ending];
            }
        }

        return gender;
    };

    return obj;
});
