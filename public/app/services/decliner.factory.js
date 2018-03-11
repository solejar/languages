//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

//this module knows how to decline words and phrases
//it possesses auxiliary functions to help itself do its job
app.factory('decliner',function(spellingRules,sharedProps,$q){

    var fleetingCons =  ['б','в','г','д','ж','з','к','л','м','н','п','т','х','ц','ч','ш','щ'];
    var consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ'];
    var hushers = ['ж','ч','ш','щ'];

    var obj = {}

    //function to decline an entire phrase with a preposition and noun/adj
    obj.declinePhrase = function(phrase){
        var deferred = $q.defer()

        //manual locking mechanism, keeps result synchronized to each other
        var nounReady = false
        var adjReady = false;

        //figure out if the noun is an exception
        obj.checkException(phrase.noun,'noun').then(function(res){
            phrase.nounException = res
            //decline the word
            obj.declineWord(phrase,'noun').then(function(declinedNoun){
                phrase.declinedNoun = declinedNoun
                nounReady = true;
                //if whole thing done, resolve it
                if(adjReady){
                    deferred.resolve(phrase.prep.name+' '+ phrase.declinedAdj+' '+phrase.declinedNoun)
                }
            })
        })

        //figure out if adj is an exception
        obj.checkException(phrase.adj,'adj').then(function(res){
            phrase.adjException = res
            //decline the word
            obj.declineWord(phrase,'adj').then(function(declinedAdj){
                phrase.declinedAdj = declinedAdj
                adjReady = true;
                if(nounReady){ //if both ready, resolve it
                    deferred.resolve(phrase.prep.name+' '+phrase.declinedAdj+' ' + phrase.declinedNoun)
                }
            })
        });

        return deferred.promise
    }

    //function to decline either a noun or adj
    obj.declineWord = function(phrase,PoS){
        var deferred = $q.defer()

        //get the currWord and ruleSet, precon that they exist
        if(PoS=='noun'){
            var currWord=phrase.noun
            var ruleSet = phrase.nounRuleSet

        }else if(PoS=='adj'){
            var currWord = phrase.adj
            var ruleSet = phrase.adjRuleSet
        }

        //if they exist, proceed
        if(currWord&&ruleSet){

            if(ruleSet){
                if(phrase.padex =='винительный'){

                    if(phrase.animate){
                        var declensionObj = ruleSet[phrase.padex][phrase.animate][phrase.plurality]
                    }else{
                        deferred.resolve('')
                    }
                }else{
                    //console.log(padex)
                    var declensionObj = ruleSet[phrase.padex][phrase.plurality]
                }
            }else{
                deferred.resolve('')
                //obj should never be reached i'm pretty sure
            }

            //apply the ending that ws found
            obj.applyEnding(currWord,declensionObj).then(function(declinedWord){
                deferred.resolve(declinedWord)
            })

        }else{
            deferred.resolve('')
        }

        return deferred.promise
    }

    //a helper function to figure out what ruleSet is needed
    obj.determineRuleSet = function(phrase,PoS){
        var ruleSetNumber = "0"

        //console.log(ruleSetNumber)
        //console.log(word)
        //console.log(PoS)
        //console.log(obj.nounException)

        //if it's an exception, then just use the provided ruleSet member
        if(phrase.adjException.word!='default' && PoS =='adj'){
            ruleSetNumber = phrase.adjException.ruleSet

        }else if(phrase.nounException.word!='default' && PoS =='noun'){
            console.log(phrase.noun + ' was found to be an exception')
            ruleSetNumber = phrase.nounException.ruleSet

        }else{ //we're gonna have to use general rules
            console.log('using general rules')
            var gen = phrase.gender

            if(PoS=='adj'){
                var adjType = spellingRules.getAdjType(phrase.adj)
                if(adjType=='hard'){
                    if(gen=='M'){
                        ruleSetNumber = "17"
                    }else if(gen=='F'){
                        ruleSetNumber = "18"
                    }else if(gen=='N'){
                        ruleSetNumber = "19"
                    }
                }else if(adjType=='soft'){
                    if(gen=='M'){
                        ruleSetNumber = "20"
                    }else if(gen=='F'){
                        ruleSetNumber = "21"
                    }else if(gen=='N'){
                        ruleSetNumber = "22"
                    }
                }
            }else if(PoS=='noun'){
                //console.log('checking noun rule group')
                var word = phrase.noun
                var gen = phrase.gender

                var len = word.length

                var lastChar = word[len-1]
                var secondLastChar = word[len-2]
                var thirdLastChar = word[len-3]

                if(gen=='M'){
                    var isFleeting = !!(fleetingCons.includes(lastChar)&&fleetingCons.includes(thirdLastChar))
                    if (lastChar=='ь'){
                        ruleSetNumber = "12"
                    }else if(lastChar=='й'){
                        ruleSetNumber = "11"
                    }else if(consonants.includes(lastChar)){
                        if(isFleeting){
                            ruleSetNumber = "16"
                        }
                        if(hushers.includes(lastChar)){
                            ruleSetNumber = "14"
                        }else{
                            ruleSetNumber = "13"
                        }
                    }else{
                        ruleSetNumber = "0" //default if nothing found
                    }
                }else if(gen=='F'){
                    var isFleeting = !!(fleetingCons.includes(secondLastChar)&&fleetingCons.includes(thirdLastChar))
                    if(lastChar=='ь'){
                        ruleSetNumber = "10"
                    }else if(lastChar =='а'){
                        if(isFleeting){
                            ruleSetNumber = "8"
                        }else{
                            ruleSetNumber = "9"
                        }
                    }else if(lastChar == 'я'){
                        if(secondLastChar=='и'){
                            ruleSetNumber = "6"
                        }else if(isFleeting){
                            ruleSetNumber = "7"
                        }else{
                            ruleSetNumber = "0" //don't think obj case exists
                        }
                    }else{
                        ruleSetNumber = "0" //default if nothing found
                    }
                }else if(gen=='N'){
                    if(lastChar=='е'){
                        if(secondLastChar=='и'){
                            ruleSetNumber ="5"
                        }else if(secondLastChar=='о'){
                            ruleSetNumber = "2"
                        }else{
                            ruleSetNumber = "3"
                        }
                    }else if(lastChar=='о'){
                        ruleSetNumber = "1"
                    }else if((secondLastChar+lastChar)=='мя'){
                        ruleSetNumber = "31"
                    }else{
                        ruleSetNumber = "0" //default if nothing found
                    }
                }
            }

        }

        //GET the rule group needed from the back
        //console.log('about to get rule groups for ' + word + ' with ruleSet number of ' + ruleSetNumber + ' and gender: ' + gender)
        var ruleSetOptions = {
            url: '/declension/ruleGroups/',
            params: {q: ruleSetNumber},
            method: 'GET',
            verbose: false
        }

        var deferred = $q.defer()

        sharedProps.httpReq(ruleSetOptions).then(function(res){
            //console.log(ruleSetOptions)
            var output = res.content[ruleSetNumber]
            console.log(output)
            deferred.resolve(output)
        })

        return deferred.promise;
    }

    //this function takes the prescribed rules and makes the necessary changes
    obj.applyEnding = function(word,declension){
        var deferred = $q.defer()

        var oper = declension.oper;
        if(oper=='none'){

            deferred.resolve(word);

        }else if(oper=='replace'){

            var howMany = declension.dropHowMany
            var stem = word.substring(0,word.length-howMany)
            var ending = declension.ending
            var ruleAdjustedEnding = spellingRules.check(stem,ending);

            deferred.resolve(stem+ruleAdjustedEnding)
        }else if(oper=='drop'){
            var len = word.length
            var temp_word = word.substring(0,len-1)
            len = len -1;
            var ending = temp_word.substring(len-2,len)
            var word = temp_word.substring(0,len-2)
            var ruleAdjustedEnding = spellingRules.check(word,ending)

            deferred.resolve(word+ruleAdjustedEnding)
        }else if(oper=='add'){

            var ending = declension.ending
            var ruleAdjustedEnding = spellingRules.check(word,ending)

            deferred.resolve(word+ruleAdjustedEnding);
        }else if(oper=='fleeting'){

            var len = word.length
            //need to figure out what the fuck to do here
            var fleetingType = declension.fleetingType
            if(fleetingType=='inject'){

                var left = word.substring(0,len-2)
                var right = word.substring(len-2,len-1)

                var newEnding = spellingRules.check(left ,'о' + right)

                //console.log(declension)
                console.log(left+newEnding)
                deferred.resolve(left+newEnding)

            }else if(fleetingType=='remove'){
                var left = word.substring(0,len-2)
                var last = word[len-1]
                var newStem = left + last
                phrase.noun = newStem

                //console.log(declension)

                console.log('about to decline '+ newStem )
                console.log(declension)
                obj.checkException(phrase.noun,'noun').then(function(res){
                    phrase.nounException = res
                    obj.declineWord(phrase,'noun').then(function(declinedWord){
                        console.log(declinedWord)
                        deferred.resolve(declinedWord)
                    })
                })
            }
        }

        return deferred.promise
    }

    //this is a helper function that determines if a given word is an exception or not
    obj.checkException = function(word,PoS){
        var deferred = $q.defer()

        console.log('getting an exception')
        console.log(word)
        console.log(PoS)

        var exceptionOptions = {
            url: '/declension/exceptions',
            params: {
                q: word
            },
            method: 'GET',
            verbose: false
        }

        sharedProps.httpReq(exceptionOptions).then(function(res){
            console.log(res)
            if(PoS=='noun'){
                deferred.resolve(res.content)
            }else if (PoS=='adj'){
                deferred.resolve(res.content)
            }
        })

        return deferred.promise
    }

    return obj
})
