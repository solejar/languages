angular.module('lang').factory('tester',function(sharedProps,$q,decliner,$timeout){
    const obj = {};

    obj.testGroups = function(saveResults,compare){
        let groupOptions = {
            url : '/ru/ruleGroups',
            params: {},
            method: 'GET',
            verbose: false
        };

        let allSame = true;
        sharedProps.httpReq(groupOptions).then(function(res){
            let ruleGroups = res.content;
            //console.log(ruleGroups)

            let declinedWords = {};
            //let promiseArr = [];

            angular.forEach(ruleGroups,function(ruleSet,ruleSetNumber){
                let word = ruleSet.example;
                declinedWords[ruleSetNumber] = {};
                declinedWords[ruleSetNumber].word = word;
                //console.log(ruleSet)

                angular.forEach(ruleSet,function(padexDict,padex){

                    //let promiseObj = {};

                    if(padex!='example' && padex!='description'){
                        declinedWords[ruleSetNumber][padex] = {};
                        if(padex=='винительный'){
                            declinedWords[ruleSetNumber][padex].animate = {};
                            declinedWords[ruleSetNumber][padex].inanimate = {};

                            let animSingleOper = padexDict.Animate.Single;
                            let animPluralOper = padexDict.Animate.Plural;

                            decliner.applyEnding(word,animSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].animate.single = declinedWord;
                            });

                            decliner.applyEnding(word,animPluralOper).then(function(declinedWord){
                                console.log('about to print');
                                declinedWords[ruleSetNumber][padex].animate.plural = declinedWord;
                            });

                            let inanimSingleOper = padexDict.Inanimate.Single;
                            let inanimPluralOper = padexDict.Inanimate.Plural;

                            decliner.applyEnding(word,inanimSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.single = declinedWord;
                            });

                            decliner.applyEnding(word,inanimPluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.plural = declinedWord;
                            });


                        }else{
                            let singleOper = padexDict.Single;

                            decliner.applyEnding(word,singleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].single = declinedWord;
                            });

                            let pluralOper = padexDict.Plural;

                            decliner.applyEnding(word,pluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].plural = declinedWord;
                            });
                        }
                    }

                });

            });

            if(compare){
                let testResultsOptions = {
                    url: '/ru/testResults',
                    params: {},
                    method: 'GET'
                };

                sharedProps.httpReq(testResultsOptions).then(function(getRes){
                    //do a for each loop to compare all vals

                    console.log('about to print declinedWords');
                    //console.log(declinedWords)

                    //this is definitely not the write way to do this. it should be a $q.all
                    if(saveResults){ //if user wants to save testResults
                        $timeout(function(){
                            let data = {};
                            data.testResults = declinedWords;

                            let testingPostOptions = {
                                url: '/ru/testResults',
                                data: data,
                                method: 'POST',
                                verbose: false
                            };

                            sharedProps.httpReq(testingPostOptions).then(function(postRes){
                                console.log('Testing results posted successfully!');
                            });
                        },10000); //just gonna stick this behind a timeout
                    }
                });
            }


        });
        //console.log('finished declining the words')

        return allSame;
    };

    return obj;
});
