angular.module('lang').filter('prepositionFilter',function(){
    const consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ'];
    const vowels = ['э','а','у','э','о','и'];

    return function(phrase){

        let phraseArr = phrase.split(' ');
        let prep = phraseArr[0];
        let successiveWord = phraseArr[1]!=""? phraseArr[1]: phraseArr[2];
        let letter1 = successiveWord[0];
        let letter2 = successiveWord[1];
        if(prep=='о'){

            if(vowels.includes(letter1)){
                prep+='б';
            }
        }else if(prep=='в'||prep=='к'){

            if(consonants.includes(letter1)&&consonants.includes(letter2)){
                prep+='о';
            }
        }

        phraseArr[0] = prep;
        return phraseArr.join(' ');
    };
});
