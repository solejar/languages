var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, $q, $timeout){
    
        
    //these are options for our front end selects, simple enough to store locally
    this.genders = ['M','F','N']    
    this.animate = ['Animate','Inanimate']
    this.pluralities = ['Single','Plural']

    //list of prepositions and their associated case options
    //pretty frickin big, so we store in db
    this.prepositions = []

    //used to determine if ending is a cons or vowel
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']

    //if word is an exception, use rules from exception dict
    this.exceptions = {}
    //if not, just use general rules
    this.endings = {}

    this.displayLang = 'ru'

    this.showSelects = true

    this.currPrep = {
        'name': '',
        'cases': [
            'винительный','родительный','творительный','предложный','именительный','дательный'
        ]
    }

    this.showAccusative = function(){
        return this.showSelects&&(this.currCase=='винительный')
    }

    this.currLabels = {
        'prepSelect': 'Предлог'
    }

    this.updateLabels = function(){
        $timeout( function(){
            this.showSelects = false
        }.bind(this), 0)
        $timeout(function(){
            this.showSelects = true
        }.bind(this),0)
    }

    //i'm going to put all this in the db in a Russian collection
    this.labels = {
        'adjSelect': {
            'en': 'Adjective',
            'ru': 'Предлогательное'
        },
        'nounSelect': {
            'en': 'Noun',
            'ru': 'Существительное'
        },
        'prepSelect': {
            'en': 'Preposition',
            'ru': 'Предлог'
        },
        'caseSelect': {
            'en': 'Case',
            'ru': 'Падеж',
            'options': {
                'винительный': {
                    'en': 'Accusative',
                    'ru': 'винительный'
                },
                'родительный': {
                    'en': 'Genitive',
                    'ru': 'родительный'
                },
                'творительный': {
                    'en': 'Instrumental',
                    'ru': 'творительный'
                },
                'предложный': {
                    'en': 'Prepositional',
                    'ru': 'предложный'
                },
                'именительный': {
                    'en': 'Nominative',
                    'ru': 'именительный'
                },
                'дательный': {
                    'en': 'Dative',
                    'ru': 'дательный'
                }
            }
        },
        'genderSelect': {
            'en': 'Gender',
            'ru': 'Род',
            'options': [
                {
                    'en': 'M',
                    'ru': 'М'
                },
                {
                    'en': 'F',
                    'ru': 'Ж'

                },
                {
                    'en': 'N',
                    'ru': 'С'
                }
            ]
        },
        'plurSelect': {
            'en': 'Plurality',
            'ru': 'Множество',
            'options': [
                {
                    'en': 'Single',
                    'ru': 'единственный'
                },
                {
                    'en': 'Plural',
                    'ru': 'множественный'
                }
            ]            
        },
        'animateSelect': {
            'en': 'Animateness',
            'ru': 'Одушевленность',
            'options': [
                {
                    'en': 'Animate',
                    'ru': 'одушевленный'
                },
                {
                    'en': 'Inanimate',
                    'ru': 'неодушевленный'
                }
            ]
        }
    }

    //GET requests made on page init, gives the page everything it needs to run
    this.initializeEndings = function(){
        //create option dicts for HTTP reqs
        var exceptionOptions = {
            url: '/exceptionsRu',
            params: {},
            method: 'GET'
        }

        var endingOptions = {
            url: '/endingsRu',
            params: {},
            method: 'GET'
        }

        var prepositionOptions = {
            url: '/getPrepositionList',
            params: {},
            method: 'GET',
        }

        var promises = [];
        console.log('about to fetch exceptions, endings, and preps!');

        //push promises onto promise arr
        promises.push(sharedProps.httpReq(exceptionOptions))
        promises.push(sharedProps.httpReq(endingOptions))
        promises.push(sharedProps.httpReq(prepositionOptions))

        //async timeout until all promise completion
        $q.all(promises).then(function(res){
            //set data structs equal to responses
            this.exceptions = res[0].content.exceptions
            this.endings = res[1].content.endings
            this.prepositions = res[2].content.prepositions
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

    //function that declines an adjective
    this.declineAdj = function(){
        //only works if all needed params are chosen
        if (this.currAdj&&this.currCase&&this.currPlurality&&(this.currGender!='all')){
            
            //parse into shorter names just for readability
            var plur = this.currPlurality;
            var gen = this.currGender;//show selected or expected? I guess just selected with class added
            var padex = this.currCase;
            var oldAdj = this.currAdj;
            var length = oldAdj.length;

            //if word is in exceptions, then use that
            if(this.exceptions.hasOwnProperty(oldAdj)){
                var endingDict = this.exceptions[oldAdj]
            }else{//use the general rules
                
                var adjType = this.getAdjType(oldAdj);
                var endingDict = this.endings['предлогательное'][adjType][gen]
            }

            //need an extra param if it's accusative
            if(padex =='винительный'){
                if(this.currAnimate){
                    var anim = this.currAnimate;
                    var declensionObj = endingDict[padex][anim][plur]
                }else{
                    return ''
                }
            }else{
                var declensionObj = endingDict[padex][plur]
            }
            //apply the ending to the adjective
            var newAdj = this.applyEnding(oldAdj,declensionObj)

            return newAdj;
        }else{
            return '';
        }
    }

    this.adjEndingGenders = {
        'ий': 'M',
        'яя': 'F',
        'ее': 'N',
        'ой': 'M',
        'ая': 'F',
        'ый': 'M',
        'ое': 'N'
    }

     //I don't like using this.currAdj here cause it's kind of messy scope wise
    //but unless I end up needing this later I'd rather not change
    //cause then non-nullity would be a precon

    //function to determine expected gender,
    //so if user picks мой and says F, then we'll mention there's probably an issue
    this.expectedGender = function(){

        var adj = this.currAdj!=null? this.currAdj: ''
        if(this.exceptions.hasOwnProperty(adj)){
            return this.exceptions[adj]['gender']
        }else{
            var len = adj.length;
            var ending = adj.substring(len-2,len)
            if (this.adjEndingGenders.hasOwnProperty(ending)){
                return this.adjEndingGenders[ending]
            }else{
                return 'all' //if for some reason ending not in there (this is weird, but will happen if user picks params before writing adj)
            }
        }
    }

    this.currGender = 'all'
    //basically overloading '==' for genders
    //let's me compare gender of words like столько which may be any gender 
    this.sameGender = function(gender1,gender2){

        if(gender1=='all'||gender2=='all'){
            return true
        }else if(gender1==gender2){
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

    //function to decline a noun
    this.declineNoun = function(){
        //wait for all params to be selected
        if (this.currNoun&&this.currCase&&this.currPlurality&&(this.currGender!='all')){
            //pull into these vars for readability
            var oldNoun = this.currNoun;
            var plur = this.currPlurality;
            var gen = this.currGender;
            var padex = this.currCase;
            var length = oldNoun.length;

            //if noun is in exception dict, use those rules
            if(this.exceptions.hasOwnProperty(this.currNoun)){
                var endingDict = this.exceptions[this.currNoun]
            }else{ //use general rules
                var endingDict = this.endings['существительное']
            }

            //need an extra param if вин.
            if(padex =='винительный'){
                if(this.currAnimate){
                    var anim = this.currAnimate;
                    var possibleEndings = endingDict[padex][anim][plur][gen]
                }else{
                    return ''
                }
            }else{
                var possibleEndings = endingDict[padex][plur][gen]
            }

            //use the last letter to determine declension
            var lastLetter = oldNoun.substring(length-1,length);

            var log = []
            var consonants = this.consonants; // need to do this cause 'this' scope doesn't work with foreach
            angular.forEach(possibleEndings,function(value,key){
                //determine ending
                if(key=='all'){
                    var declensionObj = possibleEndings[key];
                    this.push(declensionObj);

                }else if(key=='consonant'){
                    if(consonants.includes(lastLetter)){
                        var declensionObj = possibleEndings['consonant'];
                        this.push(declensionObj);
                    }
                }else{
                    if(key==lastLetter){
                        var declensionObj = possibleEndings[key];
                        this.push(declensionObj);
                    }
                }
            },log);

            //use default ending if needed
            if(!log[0]){
                if(possibleEndings.hasOwnProperty('else')){
                    var declensionObj = possibleEndings['else'];
                }else{
                    return oldNoun; //if no default, just don't decline
                }
                
            }else{
                var declensionObj = log[0] 
            }

            //apply the ending
            var newNoun = this.applyEnding(oldNoun,declensionObj);
            
            return newNoun;
        }else{
            return '';
        }
    }

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
        }else if(oper=='conditional'){

            var cond = declension['condition']
            var lastLetter = word.substring(word.length-1,word.length)

            if(cond=='consonant'){
                if(this.consonants.includes(lastLetter)){
                    var declensionObj = declension['true']
                }else{
                    var declensionObj = declension['false']
                }                
            }else if(cond==lastLetter){
                var declensionObj = declension['true']
            }else{
                var declensionObj = declension['false']
            }

            return this.applyEnding(word,declensionObj)
        }
    }

    //list of consonants that affect spelling rules
    this.softConsList = ['г','к','х','ж','ч','ш','щ','ц'];

    //see if attempted ending is compliant with spelling rules
    //tbh this is only necessary for some fringe cases, most of the spelling rules are already incorporated
    this.checkSpellingRules = function(origStem, origEnding){
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

        if(this.softConsList.includes(lastStemLetter)){
            if(firstEndingLetter=='ы'){
                newEnding = 'и'
            }else if(firstEndingLetter=='я'){
                newEnding = 'а'
            }else if(firstEndingLetter=='ю'){
                newEnding = 'у'
            }else if(!(lastStemLetter=='г'||lastStemLetter=='к'||lastStemLetter=='х')&&firstEndingLetter =='о'){
                newEnding = 'е'
            }   
        }
        
        //дорог,ых -> их
        return newEnding+endingRemainder
    } 
});