var app = angular.module('lang')

app.factory('tester',function(sharedProps,$q,decliner){
    var obj = {}

    obj.testGroups = function(saveResults,compare){
        var groupOptions = {
            url : '/ru/ruleGroups',
            params: {},
            method: 'GET',
            verbose: false
        }

        var allSame = true
        sharedProps.httpReq(groupOptions).then(function(res){
            var ruleGroups = res.content
            //console.log(ruleGroups)

            var declinedWords = {}

            var promiseArr = []

            angular.forEach(ruleGroups,function(ruleSet,ruleSetNumber){
                var word = ruleSet.example
                declinedWords[ruleSetNumber] = {}
                declinedWords[ruleSetNumber].word = word
                //console.log(ruleSet)

                angular.forEach(ruleSet,function(padexDict,padex){

                    var promiseObj = {}

                    if(padex!='example' && padex!='description'){
                        declinedWords[ruleSetNumber][padex] = {}
                        if(padex=='винительный'){
                            declinedWords[ruleSetNumber][padex].animate = {}
                            declinedWords[ruleSetNumber][padex].inanimate = {}

                            var animSingleOper = padexDict.Animate.Single
                            var animPluralOper = padexDict.Animate.Plural

                            decliner.applyEnding(word,animSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].animate.single = declinedWord
                            })

                            decliner.applyEnding(word,animPluralOper).then(function(declinedWord){
                                console.log('about to print')
                                declinedWords[ruleSetNumber][padex].animate.plural = declinedWordd
                            })

                            var inanimSingleOper = padexDict.Inanimate.Single
                            var inanimPluralOper = padexDict.Inanimate.Plural
 
                            decliner.applyEnding(word,inanimSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.single = declinedWord
                            })
                    
                            decliner.applyEnding(word,inanimPluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.plural = declinedWord
                            })
                            

                        }else{
                            var singleOper = padexDict.Single
                    
                            decliner.applyEnding(word,singleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].single = declinedWord
                            })

                            var pluralOper = padexDict.Plural
                
                            decliner.applyEnding(word,pluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].plural = declinedWord
                            })
                        }
                    }

                })
                
            });

            if(compare){
                var testResultsOptions = {
                    url: '/ru/testResults',
                    params: {},
                    method: 'GET'
                }

                sharedProps.httpReq(testResultsOptions).then(function(res){
                    //do a for each loop to compare all vals

                    console.log('about to print declinedWords')
                    //console.log(declinedWords)

                    //this timeout is purely because i'm feeling to lazy to sync my results before submission
                    if(saveResults){ //if user wants to save testResults
                        $timeout(function(){
                            var data = {}

                            data['testResults'] = declinedWords
                            var testingPostOptions = {
                                url: '/ru/testResults',
                                data: data,
                                method: 'POST',
                                verbose: false
                            }

                            sharedProps.httpReq(testingPostOptions).then(function(res){
                                console.log('Testing results posted successfully!')
                            });
                        },10000); //just gonna stick this behind a timeout
                    }
                })
            }
            
            
        });
        //console.log('finished declining the words')

        return allSame;
    }

    return obj;
})