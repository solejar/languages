var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, $q, $timeout){

    //list of prepositions and their associated case options
    this.prepositions = []
    
    this.exceptions = {}//if word is exception, use rules from exception dict 
    this.endings = {} //if not, just use general rules

    this.labels = {} //contains labels in curr language
    this.allLabels = {} //contains labels in all languages
    this.showSelects = false //this only initializes after labels are loaded

    this.displayLang = 'ru' //starting lang for interface 
    
    this.init = function(){
        this.initializeEndings() //pull data from Mongo     
        this.clearToInitial()   //initialize select vals
    }

    //clear out select vals
    this.clearToInitial = function(){
        this.currAdj = ''
        this.currNoun = ''
        this.currCase = ''

        this.declinedNoun = ''
        this.declinedAdj = ''

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

    this.submitErrorReport = function(){
        var errorReportOptions = {
            url: '/ru/errorReports',
            params: {//this is really 'data', but just checking if this works
                'name': 'test',
                'date': 'today'
            },
            method: 'POST'
        }

        console.log('submitting an error report!')
        var promises = []

        promises.push(sharedProps.httpReq(errorReportOptions))
        $q.all(promises).then(function(res){
            console.log('appears to have worked!')
        })
    }

    this.updateLabels = function(){
        $timeout( function(){
            this.showSelects = false
            this.labels = this.allLabels[this.displayLang]
        }.bind(this), 0)
        $timeout(function(){
            this.showSelects = true
        }.bind(this),0)
    }

    //GET requests made on page init, gives the page everything it needs to run
    this.initializeEndings = function(){
        //create option dicts for HTTP reqs
        var prepositionOptions = {
            url: '/ru/prepositions',
            params: {},
            method: 'GET',
        }

        var labelOptions = {
            url: '/ru/labels',
            params: {},
            method: 'GET'
        }

        var exceptionsOptions = {
            url: '/ru/exceptions',
            params: {},
            method: 'GET'
        }

        var promises = [];
        console.log('about to fetch exceptions, endings, preps, and labels!');

        //push promises onto promise arr
        promises.push(sharedProps.httpReq(exceptionsOptions))
        promises.push(sharedProps.httpReq(prepositionOptions))
        promises.push(sharedProps.httpReq(labelOptions))
        

        //async timeout until all promise completion
        $q.all(promises).then(function(res){
            //set data structs equal to responses
            this.exceptions = res[0].content.exceptions
            this.prepositions = res[1].content.prepositions
            
            this.allLabels = res[2].content.labels
            this.labels = this.allLabels[this.displayLang]           

            this.showSelects = true

        }.bind(this));
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

    this.declinePhrase = function(){
        this.declineWord(this.currNoun,'noun').then(function(declinedNoun){
            this.declinedNoun = declinedNoun
        }.bind(this))

        var declinedAdj = this.declineWord(this.currAdj,'adj').then(function(declinedAdj){
            this.declinedAdj = declinedAdj
        }.bind(this))
    }
    this.declineWord = function(currWord,PoS){

        var deferred = $q.defer()

        if(currWord){

            this.determineRuleSet(currWord,PoS).then(function(ruleSet){
                console.log(ruleSet)

                var plur = this.currPlurality
                var anim = this.currAnimate
                var padex = this.currCase

                if(ruleSet){
                    if(padex =='винительный'){
                        if(anim){
                            var declensionObj = ruleSet[padex][anim][plur]
                        }else{
                            deferred.resolve('')
                        }
                    }else{
                        console.log(padex)
                        var declensionObj = ruleSet[padex][plur]
                    }
                }else{
                    deferred.resolve('')
                    //this should never be reached i'm pretty sure
                }
                
                console.log(declensionObj)
                deferred.resolve(this.applyEnding(currWord,declensionObj))

            }.bind(this))

        }else{
            deferred.resolve('')
            
        }

        return deferred.promise
        
    }

    //aim to replace enumerated rulegroups with named ones
    this.determineRuleSet = function(word,PoS){
        //if this is an exception, get its rule set number from exceptions dict
        if(this.exceptions.hasOwnProperty(word)){
            var ruleSetNumber = this.exceptions[word].ruleSet

        }else{ //we're gonna have to use general rules

            var ruleSetNumber = ""
            var gen = this.currGender

            if(PoS=='adj'){
                var adjType = this.getAdjType(word)
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
                            ruleSetNumber = "0" //haven't made this rule set up yet
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
                            ruleSetNumber = "0" //haven't made this rule set yet
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
                    }else{
                        ruleSetNumber = "0" //default if nothing found
                    }
                }
            }

        }

        var ruleSetOptions = {
            url: '/ru/ruleGroups/',
            params: {q: ruleSetNumber},
            method: 'GET'
        }

        var promises = []

        promises.push(sharedProps.httpReq(ruleSetOptions))

        var deferred = $q.defer()

        $q.all(promises).then(function(res){
            console.log(res[0].content.ruleGroups)
            deferred.resolve(res[0].content.ruleGroups[ruleSetNumber]) //this is kind of ugly, but not really a need to return anything in this case.
            //i'd like to change that in the future

        });
        return deferred.promise;
    }

    //function to determine expected gender,
    //so if user picks мой and says F, then we'll mention there's probably an issue

    this.adjEndingGenders = {
        'ий': 'M',
        'яя': 'F',
        'ее': 'N',
        'ой': 'M',
        'ая': 'F',
        'ый': 'M',
        'ое': 'N'
    }

    this.expectedGender = function(){

        var adj = this.currAdj
        var noun = this.currNoun

        //maybe it's not appropriate to be doing this assignment in here?
        //consider rearranging to a ng-change on the input
        if(this.exceptions.hasOwnProperty(noun)){
            this.nounGender = this.exceptions[noun]['gender']
        }else{
            this.nounGender = ''
        }

        if(this.exceptions.hasOwnProperty(adj)){
            this.adjGender = this.exceptions[adj]['gender']
        }else{
            var len = adj.length;
            var ending = adj.substring(len-2,len)
            if (this.adjEndingGenders.hasOwnProperty(ending)){
                this.adjGender = this.adjEndingGenders[ending]
            }else{
                //return 'all' //if for some reason ending not in there (this is weird, but will happen if user picks params before writing adj)
                this.adjGender = ''
            }
        }

        if(this.adjGender == this.nounGender){ //if both indeterminate, return 'all'
            
            this.currGender = this.adjGender            
            return this.adjGender
        }else if(!this.adjGender){ //elif adj indeterminate, return nounGender
            this.currGender = this.nounGender
            return this.nounGender
        }else {
            this.currGender = this.adjGender
            return this.adjGender //else return adjGender
        }
        
    }

    this.expectedAnimate = function(){

        var noun = this.currNoun

        if(this.exceptions.hasOwnProperty(noun)){
            var nounAnimate = this.exception[noun].animate
            this.currAnimate = nounAnimate
            return nounAnimate
        }else{
            return ''
        }
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

    //figure out if soft or hard adjective (short currently not considered)
    this.getAdjType = function(adj){
        var length = adj.length;
        var ending = adj.substring(length-3,length);

        if(ending=='ний'||ending =='няя'||ending=='нее'){
            return 'soft'
        }else{
            return 'hard'
        }
    }

    //used to determine if ending is a cons or vowel
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']

    //it's a smaller subset of consonants which trigger the fleeting vowel exceptions
    this.fleetingCons =  ['б','в','г','д','ж','з','к','л','м','н','п','т','х','ц','ч','ш','щ']

    this.applyEnding = function(word, declension){
        var oper = declension['oper'];
        if(oper=='none'){

            return word;
        }else if(oper=='replace'){

            var howMany = declension['dropHowMany']
            var stem = word.substring(0,word.length-howMany)
            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(stem,ending);

            return stem+ruleAdjustedEnding
        }else if(oper=='drop'){

            return word.substring(0,word.length-1)
        }else if(oper=='add'){

            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(word,ending)

            return word+ruleAdjustedEnding;
        }else if(oper=='fleeting'){
            var len = word.length
            //need to figure out what the fuck to do here
            var fleetingType = declension.fleetingType
            if(fleetingType=='inject'){
                
                var left = word.substring(0,len-2)
                var right = word.substring(len-2,len)
                var newStem = left + 'о' + right

                return this.declineWord(newStem,'noun')
            }else if(fleetingType=='remove'){
                var left = word.substring(0,len-2)
                var last = word[len-1]
                var newStem = left + last
                return this.declineWord(newStem,'noun')
            }
        }
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

    //see if attempted ending is compliant with spelling rules
    //tbh this is only necessary for some fringe cases, most of the spelling rules are already incorporated
    this.checkSpellingRules = function(origStem, origEnding){
        console.log(origStem + ' ' + origEnding)

        //доро+г
        var stemLen = origStem.length;
        var lastStemLetter = origStem.substring(stemLen-1,stemLen)

        //ых-> ы
        var firstEndingLetter = origEnding.substring(0,1)
        var newEnding = firstEndingLetter

        //ых-> х
        var endingLen = origEnding.length
        var endingRemainder = origEnding.substring(1,endingLen) //either blank or the last letter

        console.log(lastStemLetter + ' ' + firstEndingLetter + ' ' + endingRemainder)

        if(this.softConsList.includes(lastStemLetter)){
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
});