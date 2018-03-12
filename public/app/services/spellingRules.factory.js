var app = angular.module('lang');

//this service verifies that declined words comply with Russian spelling rules
//also can determine gender of certain words
app.factory('spellingRules',function(){
    let obj = {}

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
        var stemLen = origStem.length;
        var lastStemLetter = origStem.substring(stemLen-1,stemLen)

        //ых-> ы
        var firstEndingLetter = origEnding.substring(0,1)
        var newEnding = firstEndingLetter

        //ых-> х
        var endingLen = origEnding.length
        var endingRemainder = origEnding.substring(1,endingLen) //either blank or the last letter

        //console.log(lastStemLetter + ' ' + firstEndingLetter + ' ' + endingRemainder)

        if(softConsList.includes(lastStemLetter)){
            if(firstEndingLetter=='ы'){
                newEnding = 'и'
            }else if(firstEndingLetter=='я'){
                newEnding = 'а'
            }else if(firstEndingLetter=='ю'){
                newEnding = 'у'
            }else if(!(lastStemLetter=='г'||lastStemLetter=='к'||lastStemLetter=='х')&&firstEndingLetter =='о'){
                if (origEnding== 'ого'){
                    newEnding = firstEndingLetter //don't change if stressed
                }else{
                    newEnding = 'е'
                }
            }
        }

        //дорог,ых -> их
        return newEnding+endingRemainder
    }

    //this function gets the adj type
    obj.getAdjType = function(adj){
        var length = adj.length;
        var ending = adj.substring(length-3,length);

        if(ending=='ний'||ending =='няя'||ending=='нее'){
            return 'soft'
        }else{
            return 'hard'
        }
    }

        //this function determines the gender of generic adjectives
    obj.genericAdjGender= function(word){
        var len = word.length;
        if(len>=2){
            var ending = word.substring(len-2,len)
            if (adjEndingGenders.hasOwnProperty(ending)){
                var gender = adjEndingGenders[ending]
            }else{
                //return 'all' //if for some reason ending not in there (this is weird, but will happen if user picks params before writing adj)
                var gender = ''
            }
        }else{
            var gender = ''
        }

        return gender
    }

    return obj;
});
