var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, spellingRules, decliner, $q, $timeout, $window, accountModifier){

    //list of prepositions and their associated case options
    this.prepositions = []
    
    this.currPhrase = {}

    this.currPhrase.adjException = {}//if word is exception, use rules from exception dict 
    this.currPhrase.nounException = {}
    this.endings = {} //if not, just use general rules

    this.labels = {} //contains labels in curr language

    this.cards = []

    this.pageInitialized = false

    this.targetLang = 'en'

    this.init = function(){

        //this.testGroups()

        var initPhrase = {
            phrase: {
                adj: 'твоя',
                noun: 'помощь',
                preposition: 'без',
                translation: 'without your help',
                declinedPhrase: 'без твоей помощи',
                plurality: 'Single',
                gender: 'F',
                padex: 'родительный'
            },
            expanded: true,
            stars: 0,
            saved: false
        }

        this.cards.push(initPhrase)

        var urlPath = $window.location.href;
        var pathSplit = urlPath.split('/')
        console.log(pathSplit[3])
        var options = {
            lang: pathSplit[3]
        }

        this.initializeValues(options).then(function(statusCode){
            this.pageInitialized = true
        }.bind(this)) //pull data from Mongo   
        //console.log(this.labels) 

        this.clearToInitial()   //initialize select vals

    }

    this.inputBlur = function(word,PoS){
        console.log(word + ' with PoS: '+ PoS + ' has just blurred')
        if(PoS=='adj'){
           decliner.checkException(word,PoS).then(function(res){
                this.currPhrase.adjException = res
                this.checkGender(word,PoS)
                decliner.determineRuleSet(this.currPhrase,'adj').then(function(ruleSet){
                    console.log(ruleSet)
                    this.currPhrase.adjRuleSet = ruleSet
                }.bind(this))
           }.bind(this)) 
           
        }else if(PoS=='noun'){
            decliner.checkException(word,PoS).then(function(res){
                this.currPhrase.nounException = res
                this.checkGender(word,PoS)
                this.checkAnimate(word,PoS)
                decliner.determineRuleSet(this.currPhrase,'noun').then(function(ruleSet){
                    console.log(ruleSet)
                    this.currPhrase.nounRuleSet = ruleSet
                }.bind(this))
           }.bind(this))             
        }
    }

    this.removeCard = function(card){
        
        var index = this.cards.indexOf(card);
        this.cards.splice(index,1);
        
    }

    //GET requests made on page init, gives the page everything it needs to run
    this.initializeValues = function(options){

        var deferred = $q.defer()
        //create option dicts for HTTP reqs
        //technically want to send actual path lang, but in this case vals don't change so I won't bother
        var prepositionOptions = {
            url: '/ru/prepositions',
            params: {},
            method: 'GET',
            verbose: false
        }

        var labelOptions = {
            url: '/'+options.lang+'/labels',
            params: {},
            method: 'GET',
            verbose: false
        }
        
        var promises = [];
        console.log('about to fetch exceptions, endings, preps, and labels!');

        //push promises onto promise arr
        
        promises.push(sharedProps.httpReq(labelOptions))
        promises.push(sharedProps.httpReq(prepositionOptions))        

        //async timeout until all promise completion
        $q.all(promises).then(function(res){
            //set data structs equal to responses
            this.labels = res[0].content
            this.prepositions = res[1].content 
             
            deferred.resolve('200')

        }.bind(this));

        return deferred.promise
    }
    //clear out select vals
    this.clearToInitial = function(){
         
        //this.adjException = {exists: false}
        //this.nounException = {exists: false}
        this.currPhrase = {}
        this.currPhrase.adjException = {}
        this.currPhrase.nounException = {}

        this.currPhrase.adj = ''
        this.currPhrase.noun = ''
        this.currPhrase.padex = ''

        this.currPhrase.declinedNoun = ''
        this.currPhrase.declinedAdj = ''

        this.currPhrase.translation = ''

        this.nounAnimate = ''

        this.currPhrase.ruleSet = {}

        //this JSON is basically equivalent to a blank prep
        this.currPhrase.prep = {
            'name': '',
            'cases': [
                'винительный','родительный','творительный','предложный','именительный','дательный'
            ]
        }

        this.currPhrase.gender = ''
        this.currPhrase.plurality = ''
        this.currPhrase.animate = ''

        this.adjGender = ''
        this.nounGender = ''

        this.onlyOneCase = false //this is a disable that may need to be cleared
    }

    //can only clear when something is there!
    this.disableClear = function(){
        var a = this.currPhrase.adj
        var b = this.currPhrase.noun
        var c = this.currPhrase.gender
        var d = this.currPhrase.prep.name
        var e = this.currPhrase.padex
        var f = this.currPhrase.plurality
        var g = this.currPhrase.animate

        return !(a||b||c||d||e||f||g);
    }

    this.user = 'Joe Schmo'

    this.savePhrase  = function(phrase){
        console.log(phrase.saved)
        if(phrase.saved == true){
            accountModifier.removeCard(phrase,this.user)
            phrase.saved = false
        }else{
            accountModifier.addCard(phrase,this.user)
            phrase.saved = true;
        }    
    }

    //these are all good candidates for directives
    this.markCard = function(phrase){

    }

    this.reportCard = function(phrase){

    }

    //this is a good candidate for a directive
    this.submitReport = function(reportType, card){
        this.pageInitialized = true 

        var data = {}
        data['currPhraseValues'] = this.currPhrase

        var errorReportOptions = {
            url: '/ru/errorReports',
            data: data,
            method: 'POST',
            verbose: false
        }

        console.log('submitting an error report!')
        sharedProps.httpReq(errorReportOptions).then(function(res){
            console.log('successfully submitted a report!')
        });
    }

    //just QoL, disables case select when there's only one case option
    //this happens frequently btw, usually род.
    this.checkCaseCount = function(caseArr){
        if(caseArr.length == 1){
            this.onlyOneCase = true;
            this.currPhrase.padex = caseArr[0];
        }else{
            this.onlyOneCase = false;
        }        
    }

    this.generateCard = function(){
        decliner.declinePhrase(this.currPhrase).then(function(declinedPhrase){
            this.currPhrase.declinedPhrase = declinedPhrase
            this.translatePhrase(declinedPhrase).then(function(translation){
                this.currPhrase.translation = translation
                var card = {}
                card.phrase = this.currPhrase
                card.expanded = false;
                card.saved = false;
                
                this.cards.push(card)

            }.bind(this))
        }.bind(this))
    }

    this.openMenu = function($mdMenu,ev){
        $mdMenu.open(ev);
    }

    //this needs to get finished up
    this.testGroups = function(){
        var groupOptions = {
            url : '/ru/ruleGroups',
            params: {},
            method: 'GET',
            verbose: false
        }

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

                            //animSingleObj.promise = this.applyEnding(word,animSingleOper)
                            this.applyEnding(word,animSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].animate.single = declinedWord
                            })

                            //var declinedWordAnimPlural = 
                            //promiseObj.promise = this.applyEnding(word,animPluralOper)
                            this.applyEnding(word,animPluralOper).then(function(declinedWord){
                                console.log('about to print')
                                declinedWords[ruleSetNumber][padex].animate.plural = declinedWord

                            })

                            var inanimSingleOper = padexDict.Inanimate.Single
                            var inanimPluralOper = padexDict.Inanimate.Plural

                            //var declinedWordInanimSingle = 
                            this.applyEnding(word,inanimSingleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.single = declinedWord
                            })
                            //var declinedWordInanimPlural = 
                            this.applyEnding(word,inanimPluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].inanimate.plural = declinedWord
                            })
                            

                        }else{
                            var singleOper = padexDict.Single
                            //var declinedWordSingle = 
                            this.applyEnding(word,singleOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].single = declinedWord
                            })

                            var pluralOper = padexDict.Plural
                            //var declinedWordPlural = 
                            this.applyEnding(word,pluralOper).then(function(declinedWord){
                                declinedWords[ruleSetNumber][padex].plural = declinedWord
                            })
                        }
                    }

                }.bind(this))
                
            }.bind(this));
            console.log('about to print declinedWords')
            //console.log(declinedWords)

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
            

        }.bind(this));
        //console.log('finished declining the words')
    }

    //this can probably be moved to a service
    this.translatePhrase = function(phrase){
        var deferred = $q.defer()

        var options = {
            url: 'ru/translations',
            params: {
                phrase: phrase,
                targetLang: this.targetLang
            },
            method: 'GET',
            verbose: false
        }

        sharedProps.httpReq(options).then(function(res){
            deferred.resolve(res.text)
            console.log(res)
        }.bind(this))

        return deferred.promise
    }

    this.inputsFresh = true

    this.disableDecline= function(){
        var a = this.inputsFresh
        var b = this.validInputs('adj')||this.validInputs('noun')

        if(a&&b){
            var key = this.currPhrase.prep.name + ' ' + this.currPhrase.adj + ' ' + this.currPhrase.noun

            if(this.cards.hasOwnProperty(key)){
                var obj = this.cards[key]
                if ((this.currPhrase.padex==obj.padex)&&(this.currPhrase.plurality==obj.plurality)&&(this.currPhrase.gender==obj.gender)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return true
        }
    }

    //function to determine expected gender,
    //so if user picks мой and says F, then we'll mention there's probably an issue

    this.checkGender = function(word,PoS){

        console.log('checking for gender')
        if(PoS=='noun'){
            if(!(this.currPhrase.nounException=='default')){
                console.log(this.currPhrase.nounException.gender)
                if(this.currPhrase.nounException.gender){
                     var gender = this.currPhrase.nounException.gender
                    this.currPhrase.gender = gender
                }else{
                    console.log('no gender found')
                    var gender = ''
                }
               
            }else{
                console.log('no nounexception yet')
                var gender = ''
            }

            this.nounGender = gender
            
        }else if(PoS=='adj'){
            if(!(this.currPhrase.adjException.word=='default')){
                console.log(this.currPhrase.adjException)
                
                if(this.currPhrase.adjException.gender){
                    var gender = this.currPhrsae.adjException.gender
                    this.currPhrase.gender = gender
                    this.adjGender = gender
                    return
                }
                
            }

            console.log('no adj exception yet')
            var gender = spellingRules.genericAdjGender(word)
            
            if(gender){
                this.currPhrase.gender = gender
            }
                
            this.adjGender = gender          
        }
    }

    this.genderKnown = function(){
        return !!(this.adjGender||this.nounGender)
    }

    this.checkAnimate = function(word){
        if(typeof this.currPhrase.nounException !== null){
            this.nounAnimate = this.currPhrase.nounException.animate
        }else{
            this.nounAnimate = ''
        }
    }

    this.animateKnown = function(){

        return !!(this.nounAnimate)
    }

    this.currPhrase.gender = ''
    //basically overloading '==' for genders
    //if either one is null, it's true
    this.sameGender = function(gender1,gender2){

        if(gender1==gender2){ //there's literally one word in the whole dict that has this, maybe try to remove it
            return true
        }else if(!gender1||!gender2){
            return true
        }else{
            return false
        }
    }
    
    //used to determine if ending is a cons or vowel
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']

    //it's a smaller subset of consonants which trigger the fleeting vowel exceptions
    this.fleetingCons =  ['б','в','г','д','ж','з','к','л','м','н','п','т','х','ц','ч','ш','щ']

    this.validInputs = function(currPoS){
        if(this.currPhrase.padex){
            if(this.currPhrase.padex=='винительный'){
                return !!(currPoS&&this.currPhrase.gender&&this.currPhrase.animate&&this.currPhrase.plurality)
            }else{
                return !!(currPoS&&this.currPhrase.gender&&this.currPhrase.plurality)
            }
        }else{
            return false
        }
    }

    this.hushers = ['ж','ч','ш','щ']
    //list of consonants that affect spelling rules
    this.softConsList = ['г','к','х','ж','ч','ш','щ','ц'];

});