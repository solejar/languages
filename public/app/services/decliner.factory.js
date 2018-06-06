//this module knows how to decline words and phrases
//it possesses auxiliary functions to help itself do its job
angular.module('lang').factory('decliner',function(spellingRules,sharedProps,$q){

    const fleetingCons =  ['б','в','г','д','ж','з','к','л','м','н','п','т','х','ц','ч','ш','щ'];
    const consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ'];
    const vowels = ['э','а','у','э','о','и'];
    const hushers = ['ж','ч','ш','щ'];

    const obj = {};

    //function to decline an entire phrase with a preposition and noun/adj
    obj.declinePhrase = function(phrase){
        const deferred = $q.defer();

        //manual locking mechanism, keeps result synchronized to each other
        let nounReady = false;
        let adjReady = false;

        //figure out if the noun is an exception
        obj.checkException(phrase.noun,'noun').then(function(res){
            phrase.nounException = res;
            //decline the word
            obj.declineWord(phrase,'noun').then(function(declinedNoun){
                phrase.declinedNoun = declinedNoun;
                nounReady = true;
                //if whole thing done, resolve it
                if(adjReady){
                    let adjustedPhrase = obj.adjustPrepositionalEnding(phrase.prep.name+' '+ phrase.declinedAdj+' '+phrase.declinedNoun);
                    deferred.resolve(adjustedPhrase);
                }
            });
        });

        //figure out if adj is an exception
        obj.checkException(phrase.adj,'adj').then(function(res){
            phrase.adjException = res;
            //decline the word
            obj.declineWord(phrase,'adj').then(function(declinedAdj){
                phrase.declinedAdj = declinedAdj;
                adjReady = true;
                if(nounReady){ //if both ready, resolve it
                    let adjustedPhrase = obj.adjustPrepositionalEnding(phrase.prep.name+' '+ phrase.declinedAdj+' '+phrase.declinedNoun);
                    deferred.resolve(adjustedPhrase);
                }
            });
        });

        return deferred.promise;
    };

    //function to decline either a noun or adj
    obj.declineWord = function(phrase,PoS){
        const deferred = $q.defer();

        //get the currWord and ruleSet, precon that they exist
        let currWord, ruleSet;
        if(PoS=='noun'){
            currWord=phrase.noun;
            ruleSet = phrase.nounRuleSet;

        }else if(PoS=='adj'){
            currWord = phrase.adj;
            ruleSet = phrase.adjRuleSet;
        }

        //if they exist, proceed
        if(currWord&&ruleSet){

            let declensionObj;

            if(phrase.padex =='винительный'){

                if(phrase.animate){
                    declensionObj = ruleSet[phrase.padex][phrase.animate][phrase.plurality];
                }else{
                    deferred.resolve(''); //happens if someone forgets to set animateness
                }
            }else{
                //console.log(padex)
                declensionObj = ruleSet[phrase.padex][phrase.plurality];
            }

            //apply the ending that was found
            obj.applyEnding(currWord,declensionObj).then(function(declinedWord){
                deferred.resolve(declinedWord);
            });

        }else{
            deferred.resolve('');
        }

        return deferred.promise;
    };

    obj.adjustPrepositionalEnding = function(phrase){

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

    obj.generalRuleSetNumberAdj = function(adjPhrase){
        let ruleSetNumber;
        let adjType = spellingRules.getAdjType(adjPhrase.adj);
        let gen = adjPhrase.gender;

        if(adjType=='hard'){
            if(gen=='M'){
                ruleSetNumber = "17";
            }else if(gen=='F'){
                ruleSetNumber = "18";
            }else if(gen=='N'){
                ruleSetNumber = "19";
            }
        }else if(adjType=='soft'){
            if(gen=='M'){
                ruleSetNumber = "20";
            }else if(gen=='F'){
                ruleSetNumber = "21";
            }else if(gen=='N'){
                ruleSetNumber = "22";
            }
        }
        return ruleSetNumber;
    };

    obj.generalRuleSetNumberNoun = function(nounPhrase){
        let ruleSetNumber;
        //console.log('checking noun rule group')
        let word = nounPhrase.noun;
        let gen = nounPhrase.gender;

        let len = word.length;

        let lastChar = word[len-1];
        let secondLastChar = word[len-2];
        let thirdLastChar = word[len-3];

        let isFleeting;
        if(gen=='M'){
            isFleeting = !!(fleetingCons.includes(lastChar)&&fleetingCons.includes(thirdLastChar));
            if (lastChar=='ь'){
                ruleSetNumber = "12";
            }else if(lastChar=='й'){
                ruleSetNumber = "11";
            }else if(consonants.includes(lastChar)){
                if(isFleeting){
                    ruleSetNumber = "16";
                }
                if(hushers.includes(lastChar)){
                    ruleSetNumber = "14";
                }else{
                    ruleSetNumber = "13";
                }
            }
        }else if(gen=='F'){
            isFleeting = !!(fleetingCons.includes(secondLastChar)&&fleetingCons.includes(thirdLastChar));
            if(lastChar=='ь'){
                ruleSetNumber = "10";
            }else if(lastChar =='а'){
                if(isFleeting){
                    ruleSetNumber = "8";
                }else{
                    ruleSetNumber = "9";
                }
            }else if(lastChar == 'я'){
                if(secondLastChar=='и'){
                    ruleSetNumber = "6";
                }else if(isFleeting){
                    ruleSetNumber = "7";
                }else{
                    ruleSetNumber = "0"; //don't think obj case exists
                }
            }
        }else if(gen=='N'){
            if(lastChar=='е'){
                if(secondLastChar=='и'){
                    ruleSetNumber ="5";
                }else if(secondLastChar=='о'){
                    ruleSetNumber = "2";
                }else{
                    ruleSetNumber = "3";
                }
            }else if(lastChar=='о'){
                ruleSetNumber = "1";
            }else if((secondLastChar+lastChar)=='мя'){
                ruleSetNumber = "31";
            }
        }

        return ruleSetNumber;
    };

    //a helper function to figure out what ruleSet is needed
    obj.determineRuleSet = function(phrase,PoS){
        let ruleSetNumber = "0"; //0 is default

        //if it's an exception, then just use the provided ruleSet member
        if(phrase.adjException.word!='default' && PoS =='adj'){
            ruleSetNumber = phrase.adjException.ruleSet;

        }else if(phrase.nounException.word!='default' && PoS =='noun'){
            console.log(phrase.noun + ' was found to be an exception');
            ruleSetNumber = phrase.nounException.ruleSet;

        }else{ //we're gonna have to use general rules
            console.log('using general rules');

            if(PoS=='adj'){
                ruleSetNumber = obj.generalRuleSetNumberAdj(phrase);
            }else if(PoS=='noun'){
                ruleSetNumber = obj.generalRuleSetNumberNoun(phrase);
            }
        }

        //GET the rule group needed from the back
        //console.log('about to get rule groups for ' + word + ' with ruleSet number of ' + ruleSetNumber + ' and gender: ' + gender)
        let ruleSetOptions = {
            url: '/declension/ruleGroups/',
            params: {q: ruleSetNumber},
            method: 'GET',
            verbose: false
        };

        const deferred = $q.defer();

        sharedProps.httpReq(ruleSetOptions).then(function(res){
            //console.log(ruleSetOptions)
            let output = res.content[ruleSetNumber];
            console.log(output);
            deferred.resolve(output);
        });

        return deferred.promise;
    };

    //this function takes the prescribed rules and makes the necessary changes
    obj.applyEnding = function(word,declension){
        const deferred = $q.defer();

        let oper = declension.oper;
        if(oper=='none'){

            deferred.resolve(word);

        }else if(oper=='replace'){

            let howMany = declension.dropHowMany;
            let stem = word.substring(0,word.length-howMany);
            let ending = declension.ending;
            let ruleAdjustedEnding = spellingRules.check(stem,ending);

            deferred.resolve(stem+ruleAdjustedEnding);
        }else if(oper=='drop'){
            let len = word.length;
            let temp_word = word.substring(0,len-1);
            len = len -1;
            let ending = temp_word.substring(len-2,len);
            let new_stem = temp_word.substring(0,len-2);
            let ruleAdjustedEnding = spellingRules.check(new_stem,ending);

            deferred.resolve(new_stem+ruleAdjustedEnding);
        }else if(oper=='add'){

            let ending = declension.ending;
            let ruleAdjustedEnding = spellingRules.check(word,ending);

            deferred.resolve(word+ruleAdjustedEnding);
        }else if(oper=='fleeting'){

            let len = word.length;
            let fleetingType = declension.fleetingType;
            if(fleetingType=='inject'){

                let left = word.substring(0,len-2);
                let right = word.substring(len-2,len-1);

                let newEnding = spellingRules.check(left ,'о' + right);

                //console.log(declension)
                console.log(left+newEnding);
                deferred.resolve(left+newEnding);

            }else if(fleetingType=='remove'){
                let left = word.substring(0,len-2);
                let last = word[len-1];
                let newStem = left + last;
                let newPhrase = {};
                newPhrase.noun = newStem;

                //console.log(declension)

                console.log('about to decline '+ newStem );
                console.log(declension);
                obj.checkException(newPhrase.noun,'noun').then(function(res){
                    newPhrase.nounException = res;
                    obj.declineWord(newPhrase,'noun').then(function(declinedWord){
                        console.log(declinedWord);
                        deferred.resolve(declinedWord);
                    });
                });
            }
        }

        return deferred.promise;
    };

    //this is a helper function that determines if a given word is an exception or not
    obj.checkException = function(word,PoS){
        const deferred = $q.defer();

        console.log('getting an exception');
        //console.log(word);
        //console.log(PoS);

        let exceptionOptions = {
            url: '/declension/exceptions',
            params: {
                q: word
            },
            method: 'GET',
            verbose: false
        };

        sharedProps.httpReq(exceptionOptions).then(function(res){
            console.log(res);
            if(PoS=='noun'){
                deferred.resolve(res.content);
            }else if (PoS=='adj'){
                deferred.resolve(res.content);
            }
        });

        return deferred.promise;
    };

    return obj;
});
