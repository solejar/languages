var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, $q){

    //to do list:    
    
    //remaining exceptions : 4/5/6
        //add family nouns (eventually, idgaf tbh)
            //ребёнок
            //брать
            //сестра
            //etc
        //add fleeting vowel nouns 
            //девушка
            //звонок
            //etc.
    //о -> об, в -> во: 1
    //add gender suggestion: 2
        //class change
        //select val?
        //display warning if mismatch
        //separate out gender, plurality both on front and on noun/adj declension
    //move on to document reading : 4 (I think)
    //figure out some methodical way to do unit testing: 4/5/6
        //run through all options with assertions?
        //karma + jasmine?
    //set up post request with noted inaccuracies : 3 this is like a prelease thing
    //comment: 1
        
    this.genders = ['M','F','N']    
    this.animate = ['Animate','Inanimate']
    this.pluralities = ['Single','Plural']
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
    this.vowels = ['а','э','ы','у','о','я','е','ё','ю','и']

    this.exceptions = {}

    this.sameGender = function(gender1,gender2){
        if(gender1=='all'||gender2=='all'){
            return true
        }else if(gender1==gender2){
            return true
        }else{
            return false
        }
    }

    this.getExceptions = function(){
        var options = {
            url: '/exceptionsRu',
            params: {},
            method: 'GET'
        }

        var promises = [];
        console.log('about to fetch exceptions!')

        promises.push(sharedProps.httpReq(options))

        $q.all(promises).then(function(res){
            this.exceptions = res[0].content.exceptions;
        }.bind(this));
    }

    this.getEndings = function(){
        var options = {
            url: '/endingsRu',
            params: {},
            method: 'GET'
        }

        var promises = [];
        console.log('about to fetch endings!')

        promises.push(sharedProps.httpReq(options))

        $q.all(promises).then(function(res){
            this.endingsDict = res[0].content.endings;
        }.bind(this));
    }

    this.getPrepositions = function(){

        var options = {
            url: '/getPrepositionList',
            params: {},
            method: 'GET',
        }

        var promises = [];

        console.log('about to fetch prepositions')

        promises.push(sharedProps.httpReq(options))

        $q.all(promises).then(function(res){
            this.prepositions = res[0].content.prepositions;
        }.bind(this));
        
    }
    this.prepositions = []

    this.checkCaseCount = function(caseArr){
        if(caseArr.length == 1){
            this.onlyOneCase = true;
            this.currCase = caseArr[0];
        }else{
            this.onlyOneCase = false;
        }
        
    }

    this.declineAdj = function(){
        if (this.currAdj&&this.currCase&&this.currPlurality&&this.currGender){
            
            var plur = this.currPlurality;
            var gen = this.currGender;//show selected or expected?
            var padex = this.currCase;
            var oldAdj = this.currAdj;
            var length = oldAdj.length;

            if(this.exceptions.hasOwnProperty(oldAdj)){
                var endingDict = this.exceptions[oldAdj]
            }else{
                var adjType = this.getAdjType(oldAdj);
                var endingDict = this.endingsDict['предлогательное'][adjType][gen]
            }

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
            

            var stem = oldAdj.substring(0,length-2);
            var newAdj = this.applyEnding(oldAdj,declensionObj)

            return newAdj;
        }else{
            return '';
        }
    }

    this.expectedGender = function(adj){
        if(this.exceptions.hasOwnProperty(adj)){
            return this.exceptions[adj]['gender']
        }
    }
    this.getAdjType = function(adj){
        var length = adj.length;
        var ending = adj.substring(length-3,length);

        if(ending=='ний'||ending =='няя'||ending=='нее'){
            return 'soft'
        }else{
            return 'hard'
        }
    }

    this.declineNoun = function(){
        if (this.currNoun&&this.currCase&&this.currPlurality&&this.currGender){
            var oldNoun = this.currNoun;
            var plur = this.currPlurality;
            var gen = this.currGender;
            var padex = this.currCase;
            var length = oldNoun.length;

            if(this.exceptions.hasOwnProperty(this.currNoun)){
                var endingDict = this.exceptions[this.currNoun]
            }else{
                var endingDict = this.endingsDict['существительное']
            }

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

            var lastLetter = oldNoun.substring(length-1,length);

            var log = []
            var consonants = this.consonants;
            angular.forEach(possibleEndings,function(value,key){
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

            if(!log[0]){
                if(possibleEndings.hasOwnProperty('else')){
                    var declensionObj = possibleEndings['else'];
                }else{
                    return oldNoun;
                }
                
            }else{
                var declensionObj = log[0]
            }

            //console.log(declensionObj);

            var newNoun = this.applyEnding(oldNoun,declensionObj);
            //console.log(newNoun)
            
            return newNoun;
        }else{
            return '';
        }
    }

    this.applyEnding = function(noun, declension){
        //console.log(declension)
        var oper = declension['oper'];
        if(oper=='none'){

            return noun;
        }else if(oper=='replace'){

            var howMany = declension['dropHowMany']
            var stem = noun.substring(0,noun.length-howMany)
            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(stem,ending);

            return stem+ruleAdjustedEnding
        }else if(oper=='drop'){

            return noun.substring(0,noun.length-1)
        }else if(oper=='add'){

            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(noun,ending)

            return noun+ruleAdjustedEnding;
        }else if(oper=='conditional'){

            var cond = declension['condition']
            var lastLetter = noun.substring(noun.length-1,noun.length)

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

            return this.applyEnding(noun,declensionObj)
        }
    }

    this.softConsList = ['г','к','х','ж','ч','ш','щ','ц'];

    this.checkSpellingRules = function(origStem, origEnding){
        console.log(origStem + ' ' + origEnding)

        var stemLen = origStem.length;
        var lastStemLetter = origStem.substring(stemLen-1,stemLen)

        var firstEndingLetter = origEnding.substring(0,1)
        var newEnding = firstEndingLetter

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
                newEnding = 'е'
            }
            
        }
        
        return newEnding+endingRemainder
    }

    this.endingsDict = {}      
   
    

});