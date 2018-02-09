var app = angular.module('lang');

app.filter('prepositionFilter',function(){
    return function(phrase){

        var phraseArr = phrase.split(' ')
        var prep = phraseArr[0]
        var successiveWord = phraseArr[1]!=""? phraseArr[1]: phraseArr[2] 
        var let1 = successiveWord[0]
        var let2 = successiveWord[1]
        if(prep=='о'){
            var vowels = ['э','а','у','э','о','и']
             
            if(vowels.includes(let1)){
                prep+='б'
            }
        }else if(prep=='в'||prep=='к'){
            var consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
            if(consonants.includes(let1)&&consonants.includes(let2)){
                prep+='о'
            }
        }

        phraseArr[0] = prep
        return phraseArr.join(' ')
    }
})