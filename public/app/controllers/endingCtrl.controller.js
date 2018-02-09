var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, spellingRules, $q, $timeout, $window){

    //list of prepositions and their associated case options
    this.prepositions = []
    
    this.adjException = {}//if word is exception, use rules from exception dict 
    this.nounException = {}
    this.endings = {} //if not, just use general rules

    this.labels = {} //contains labels in curr language

    this.phrases = {}

    this.currGender = 'M'

    this.pageInitialized = false

    this.targetLang = 'en'

    this.init = function(){

        //this.testGroups()

        var initPhrase = {
            adj: 'твоя',
            noun: 'помощь',
            preposition: 'без',
            translation: 'without your help',
            declinedPhrase: 'без твоей помощи',
            plurality: 'Single',
            gender: 'F',
            padex: 'родительный',
            expanded: true,
            stars: 0,
            saved: false
        }

        this.phrases[(initPhrase.preposition+' '+initPhrase.adj+' '+initPhrase.noun)]=initPhrase

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
           this.checkException(word,PoS).then(function(res){
                this.checkGender(word,PoS)
           }.bind(this)) 
           
        }else if(PoS=='noun'){
            this.checkException(word,PoS).then(function(res){
                this.checkGender(word,PoS)
                this.checkAnimate(word,PoS)
           }.bind(this))             
        }
    }

    this.removePhrase = function(phraseObj){
        var key = phraseObj.preposition + ' ' + phraseObj.adj + ' ' + phraseObj.noun
        //console.log(key)
        if(this.phrases.hasOwnProperty(key)){
            delete this.phrases[key]
        }
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
        this.adjException = {}
        this.nounException = {}

        this.currAdj = ''
        this.currNoun = ''
        this.currCase = ''

        this.declinedNoun = ''
        this.declinedAdj = ''

        this.currTranslation = ''

        this.nounAnimate = ''

        this.ruleSet = {}

        //this JSON is basically equivalent to a blank prep
        this.currPrep = {
            'name': '',
            'cases': [
                'винительный','родительный','творительный','предложный','именительный','дательный'
            ]
        }

        this.currGender = ''
        this.currPlurality = ''
        this.currAnimate = ''

        this.adjGender = ''
        this.nounGender = ''

        this.onlyOneCase = false //this is a disable that may need to be cleared
    }

    //can only clear when something is there!
    this.disableClear = function(){
        var a = this.currAdj
        var b = this.currNoun
        var c = this.currGender
        var d = this.currPrep.name
        var e = this.currCase
        var f = this.currPlurality
        var g = this.currAnimate

        return !(a||b||c||d||e||f||g);
    }

    this.user = 'Joe Schmo'

    this.savePhrase  = function(phrase){
        console.log(phrase.saved)
        if(phrase.saved == true){
            this.removePhraseFromUser(phrase,this.user)
            phrase.saved = false
        }else{
            this.addPhraseToUser(phrase,this.user)
            phrase.saved = true;
        } 
        
    }

    this.removePhraseFromUser= function(phrase,user){

    }
    this.addPhraseToUser =function(phrase,user){

    }
    //just a function to collate all inputs, maybe this isn't necessary
    //maybe I will flesh this out for more of the other functions
    //maybe I will just make this an objet to begin with, that would save me the trouble

    this.allInputs = function(){
        var obj = {}

        obj.gender = this.currGender
        obj.animate = this.currAnimate
        obj.plurality = this.currPlurality
        obj.padex = this.currCase
        obj.preposition = this.currPrep.name
        obj.noun = this.currNoun
        obj.adj = this.currAdj
        obj.declinedNoun = this.declinedNoun
        obj.declinedAdj = this.declinedAdj
        obj.ruleSet = this.ruleSet
        obj.declinedPhrase = this.declinedPhrase
        obj.translation = this.currTranslation

        return obj
    }

    this.submitReport = function(reportType){
         this.pageInitialized = true 
        //look at reorganizing this...
        var allInputs = this.allInputs()

        var data = {}
        data['allInputs'] = allInputs

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
            this.currCase = caseArr[0];
        }else{
            this.onlyOneCase = false;
        }        
    }

    this.generateCard = function(){
        this.declinePhrase().then(function(declinedPhrase){
            this.declinedPhrase = declinedPhrase
            this.translatePhrase(declinedPhrase).then(function(translation){
                this.currTranslation = translation
                var card = this.allInputs()
                card.expanded = false
                var key = card.preposition +' ' + card.adj + ' ' + card.noun
                //console.log(key)
                this.phrases[key]=card
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

    this.markPhrase = function(phrase){

    }

    this.reportPhrase = function(phrase){

    }

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

    this.declinePhrase = function(){
        var deferred = $q.defer()

        this.nounReady = false
        this.adjReady = false;
        var gen = this.currGender
        var padex = this.currCase
        var anim = this.currAnimate
        var plur = this.currPlurality

        this.checkException(this.currNoun,'noun').then(function(res){
            this.declineWord(this.currNoun,'noun', gen,padex,anim,plur).then(function(declinedNoun){
                this.declinedNoun = declinedNoun
                this.nounReady = true;
                if(this.adjReady){
                    deferred.resolve(this.currPrep.name+' '+ this.declinedAdj+' '+this.declinedNoun)
                }
            }.bind(this))
        }.bind(this))

        this.checkException(this.currAdj,'adj').then(function(res){

            this.declineWord(this.currAdj,'adj',gen,padex,anim,plur).then(function(declinedAdj){
                this.declinedAdj = declinedAdj
                this.adjReady = true;
                if(this.nounReady){
                    deferred.resolve(this.currPrep.name+' '+this.declinedAdj+' ' + this.declinedNoun)
                }
            }.bind(this))
        }.bind(this));

        return deferred.promise
    }

    this.declineWord = function(currWord,PoS,gender,padex,anim,plur){

        console.log(currWord)
        console.log(PoS)
        console.log(gender)
        console.log(padex)
        console.log(anim)
        console.log(plur)
        var deferred = $q.defer()

        if(currWord){

            this.determineRuleSet(currWord,PoS,gender,padex,anim,plur).then(function(ruleSet){
                console.log(ruleSet)
                this.ruleSet = ruleSet

                if(ruleSet){
                    if(padex =='винительный'){

                        if(anim){
                            var declensionObj = ruleSet[padex][anim][plur]
                        }else{
                            deferred.resolve('')
                        }
                    }else{
                        //console.log(padex)
                        var declensionObj = ruleSet[padex][plur]

                    }
                }else{
                    deferred.resolve('')
                    //this should never be reached i'm pretty sure
                }

                this.applyEnding(currWord,declensionObj).then(function(declinedWord){
                    deferred.resolve(declinedWord)
                })

            }.bind(this))
           

        }else{
            deferred.resolve('')
            
        }

        return deferred.promise
        
    }

    this.inputsFresh = true

    this.disableDecline= function(){
        var a = this.inputsFresh
        var b = this.validInputs('adj')||this.validInputs('noun')

        if(a&&b){
            var key = this.currPrep.name + ' ' + this.currAdj + ' ' + this.currNoun

            if(this.phrases.hasOwnProperty(key)){
                var obj = this.phrases[key]
                if ((this.currCase==obj.padex)&&(this.currPlurality==obj.plurality)&&(this.currGender==obj.gender)){
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

    this.checkException = function(word,PoS){

        var deferred = $q.defer()

        console.log('getting an exception')
        console.log(word)
        console.log(PoS)
        
        var exceptionOptions = {
            url: '/ru/exceptions',
            params: {
                q: word
            },
            method: 'GET',
            verbose: false
        }

        sharedProps.httpReq(exceptionOptions).then(function(res){
            console.log(res)
            if(PoS=='noun'){

                this.nounException = res.content

                deferred.resolve('200')
                
            }else if (PoS=='adj'){
                    
                this.adjException = res.content
                
                deferred.resolve('200')
                
            }
        }.bind(this))

        return deferred.promise
    }

    //aim to replace enumerated rulegroups with named ones
    //using nounException and adjException from outside is really dangerous
    //try to fix
    this.determineRuleSet = function(word,PoS,gender){
        //if this is an exception, get its rule set number from exceptions dict
        var ruleSetNumber = "0"

        //console.log(ruleSetNumber)
        //console.log(word)
        //console.log(PoS)
        //console.log(this.nounException)
        if(this.adjException.word!='default' && PoS =='adj'){
            ruleSetNumber = this.adjException.ruleSet

        }else if(this.nounException.word!='default' && PoS =='noun'){
            console.log(word + ' was found to be an exception')
            ruleSetNumber = this.nounException.ruleSet
            
        }else{ //we're gonna have to use general rules
            console.log('using general rules')
            var gen = gender

            if(PoS=='adj'){
                var adjType = spellingRules.getAdjType(word)
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
                var len = word.length

                var lastChar = word[len-1]
                var secondLastChar = word[len-2]
                var thirdLastChar = word[len-3]

                if(gen=='M'){
                    var isFleeting = !!(this.fleetingCons.includes(lastChar)&&this.fleetingCons.includes(thirdLastChar))
                    if (lastChar=='ь'){
                        ruleSetNumber = "12"
                    }else if(lastChar=='й'){
                        ruleSetNumber = "11"
                    }else if(this.consonants.includes(lastChar)){
                        if(isFleeting){
                            ruleSetNumber = "16" 
                        }
                        if(this.hushers.includes(lastChar)){
                            ruleSetNumber = "14"
                        }else{
                            ruleSetNumber = "13"
                        }
                    }else{
                        ruleSetNumber = "0" //default if nothing found
                    }
                }else if(gen=='F'){
                    var isFleeting = !!(this.fleetingCons.includes(secondLastChar)&&this.fleetingCons.includes(thirdLastChar))
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
                            ruleSetNumber = "0" //don't think this case exists
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

        //console.log('about to get rule groups for ' + word + ' with ruleSet number of ' + ruleSetNumber + ' and gender: ' + gender)
        var ruleSetOptions = {
            url: '/ru/ruleGroups/',
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
        //console.log(ruleSetOptions)

        return deferred.promise;
    }

    //function to determine expected gender,
    //so if user picks мой and says F, then we'll mention there's probably an issue

    this.checkGender = function(word,PoS){

        console.log('checking for gender')
        if(PoS=='noun'){
            if(!(this.nounException=='default')){
                console.log(this.nounException.gender)
                if(this.nounException.gender){
                     var gender = this.nounException.gender
                    this.currGender = gender
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
            if(!(this.adjException.word=='default')){
                console.log(this.adjException)
                
                if(this.adjException.gender){
                    var gender = this.adjException.gender
                    this.currGender = gender
                    this.adjGender = gender
                    return
                }
                
            }

            console.log('no adj exception yet')
            var gender = spellingRules.genericAdjGender(word)
            
            if(gender){
                this.currGender = gender
            }
                
            this.adjGender = gender          
        }
    }
    this.genderKnown = function(){
        return !!(this.adjGender||this.nounGender)
    }

    this.checkAnimate = function(word){
        if(typeof this.nounException !== null){
            this.nounAnimate = this.nounException.animate
        }else{
            this.nounAnimate = ''
        }
    }

    this.animateKnown = function(){

        return !!(this.nounAnimate)
    }

    this.currGender = ''
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

    this.applyEnding = function(word, declension){
        var deferred = $q.defer()

        var oper = declension.oper;
        if(oper=='none'){

            deferred.resolve(word);
        }else if(oper=='replace'){

            var howMany = declension.dropHowMany
            var stem = word.substring(0,word.length-howMany)
            var ending = declension.ending
            var ruleAdjustedEnding = spellingRules.check(stem,ending);

            //return stem+ruleAdjustedEnding
            deferred.resolve(stem+ruleAdjustedEnding)
        }else if(oper=='drop'){
            var len = word.length
            var temp_word = word.substring(0,len-1)
            len = len -1;
            var ending = temp_word.substring(len-2,len)
            var word = temp_word.substring(0,len-2)
            var ruleAdjustedEnding = spellingRules.check(word,ending)

            //return word.substring(0,word.length-1)
            //return word+ruleAdjustedEnding;
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

                //this.nounException.word = 'default' //this is a temp measure

                //console.log(declension)
                console.log(left+newEnding)
                deferred.resolve(left+newEnding)
                
            }else if(fleetingType=='remove'){
                var left = word.substring(0,len-2)
                var last = word[len-1]
                var newStem = left + last

                //this.nounException.word = 'default' //this is a temp measure
               
                //console.log(declension)
                //return newStem
                console.log('about to decline '+ newStem )
                console.log(declension)
                this.checkException(newStem,'noun').then(function(res){
                    this.declineWord(newStem,'noun',declension.gender,declension.padex,declension.animate,declension.plur).then(function(declinedWord){
                        console.log(declinedWord)
                        deferred.resolve(declinedWord)
                    })
                }.bind(this))
                
            }
        }

        return deferred.promise
    }

    this.validInputs = function(currPoS){
        if(this.currCase){
            if(this.currCase=='винительный'){
                return !!(currPoS&&this.currGender&&this.currAnimate&&this.currPlurality)
            }else{
                return !!(currPoS&&this.currGender&&this.currPlurality)
            }
        }else{
            return false
        }
    }

    this.hushers = ['ж','ч','ш','щ']
    //list of consonants that affect spelling rules
    this.softConsList = ['г','к','х','ж','ч','ш','щ','ц'];

});