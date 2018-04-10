angular.module('lang').controller('declinerCtrl',function( //keep an eye on this name, it might get confused with the service
    sharedProps,
    spellingRules,
    decliner,
    translator,
    $q,
    $window,
    account,
    cardFactory)
{

    //list of prepositions and their associated case options
    this.prepositions = [];

    this.currPhrase = {};

    this.currPhrase.adjException = {};//if word is exception, use rules from exception dict
    this.currPhrase.nounException = {};
    this.endings = {}; //if not, just use general rules

    this.labels = {}; //contains labels in curr language

    this.cards = [];

    this.pageInitialized = false;

    this.targetLang = 'en';

    this.init = function(){

        let tempCards = cardFactory.getCardsByType('declension');
        //let cards = cardFactory.getCards('declension'); soon my friends!
        this.cards = cardFactory.markupCards(tempCards);
        console.log(this.cards);

        let urlPath = $window.location.href;
        let pathSplit = urlPath.split('/');
        console.log(pathSplit[3]);
        let options = {
            //lang: pathSplit[3]
            lang: 'en' //not necessarily sure how tenable a multi language view is at this stage of dev, so just spoof 'en'
        };

        this.initializeValues(options).then(function(statusCode){
            if(statusCode=='200'){
                this.pageInitialized = true;
            }else{
                console.log('page failed to initialize with statusCode:,', statusCode);
            }

        }.bind(this)); //pull data from Mongo
        //console.log(this.labels)

        this.clearToInitial();   //initialize select vals

    };

    this.inputBlur = function(word,PoS){
        console.log(word + ' with PoS: '+ PoS + ' has just blurred');
        if(PoS=='adj'){
           decliner.checkException(word,PoS).then(function(res){
                this.currPhrase.adjException = res;
                this.checkGender(word,PoS);
                decliner.determineRuleSet(this.currPhrase,'adj').then(function(ruleSet){
                    console.log(ruleSet);
                    this.currPhrase.adjRuleSet = ruleSet;
                }.bind(this));
           }.bind(this));

        }else if(PoS=='noun'){
            decliner.checkException(word,PoS).then(function(res){
                this.currPhrase.nounException = res;
                this.checkGender(word,PoS);
                this.checkAnimate(this.currPhrase.nounException);
                decliner.determineRuleSet(this.currPhrase,'noun').then(function(ruleSet){
                    console.log(ruleSet);
                    this.currPhrase.nounRuleSet = ruleSet;
                }.bind(this));
           }.bind(this));
        }
    };

    //GET requests made on page init, gives the page everything it needs to run
    this.initializeValues = function(options){

        const deferred = $q.defer();
        //create option dicts for HTTP reqs
        //technically want to send actual path lang, but in this case vals don't change so I won't bother
        let prepositionOptions = {
            url: '/declension/prepositions',
            params: {},
            method: 'GET',
            verbose: false
        };

        let labelOptions = {
            url: '/declension/labels',
            params: {
                lang: options.lang
            },
            method: 'GET',
            verbose: false
        };

        let promises = [];
        console.log('about to fetch exceptions, endings, preps, and labels!');

        //push promises onto promise arr
        promises.push(sharedProps.httpReq(labelOptions));
        promises.push(sharedProps.httpReq(prepositionOptions));

        //async timeout until all promise completion
        $q.all(promises).then(function(res){
            //set data structs equal to responses
            this.labels = res[0].content;
            this.prepositions = res[1].content;

            deferred.resolve('200');

        }.bind(this));

        return deferred.promise;
    };

    //clear out select vals
    this.clearToInitial = function(){

        this.prepSearchText = '';
        this.selectedPrep = '';

        this.currPhrase = {};
        this.currPhrase.adjException = {};
        this.currPhrase.nounException = {};

        this.currPhrase.adj = '';
        this.currPhrase.noun = '';
        this.currPhrase.padex = '';

        this.currPhrase.declinedNoun = '';
        this.currPhrase.declinedAdj = '';

        this.currPhrase.translation = '';

        this.nounAnimate = '';

        this.currPhrase.ruleSet = {};

        //this JSON is basically equivalent to a blank prep
        this.currPhrase.prep = {
            'name': '',
            'cases': [
                'винительный','родительный','творительный','предложный','именительный','дательный'
            ]
        };

        this.currPhrase.gender = '';
        this.currPhrase.plurality = '';
        this.currPhrase.animate = '';

        this.adjGender = '';
        this.nounGender = '';

        this.onlyOneCase = false; //this is a disable that may need to be cleared
    };

    this.changePrep = function(newPrep){
        let prep;
        if(!newPrep){
            prep = {
                name: '',
                cases: ['винительный','творительный','именительный','родительный','предложный','дательный']
            };
            this.currPhrase.padex = '';
        }else{
            prep = newPrep;
        }
        this.currPhrase.prep = prep;
        this.checkCaseCount(prep.cases);

    };

    //can only clear when something is there!
    this.disableClear = function(){
        let a,b,c,d,e,f,g;
        a = this.currPhrase.adj;
        b = this.currPhrase.noun;
        c = this.currPhrase.gender;
        d = this.currPhrase.prep;
        e = this.currPhrase.padex;
        f = this.currPhrase.plurality;
        g = this.currPhrase.animate;

        return !(a||b||c||d||e||f||g);
    };

    //just QoL, disables case select when there's only one case option
    //this happens frequently btw, usually род.
    this.checkCaseCount = function(caseArr){
        if(caseArr.length == 1){
            this.onlyOneCase = true;
            this.currPhrase.padex = caseArr[0];
        }else{
            this.onlyOneCase = false;
        }
    };

    //these three function are helpers for the preposition automcomplete
    this.querySearch = function(query){

        let results = query ? this.prepositions.filter(this.createFilterFor(query)): this.prepositions;
        return results;
    };

    this.createFilterFor = function(query){
        let lowercaseQuery = angular.lowercase(query);

        return function filterFn(prep){
            return (prep.name.toLowerCase().indexOf(lowercaseQuery)===0);
        };
    };

    this.searchTextChange = function(newSearchText){
        //this logic lets user get away with just typing and not actually selecting an item
        let results = this.querySearch(newSearchText);
        if(results.length==1){
            //this.currPhrase.prep = results[0];
            this.changePrep(results[0]);
        }
    };

    //this function generates a card
    this.generateCard = function(){
        //console.log('generating a card');
        this.showWaitSpin = true;
        decliner.declinePhrase(this.currPhrase).then(function(declinedPhrase){
            //console.log('just declined it');
            this.showWaitSpin = false;
            this.currPhrase.declinedPhrase = declinedPhrase;
            translator.translatePhrase(declinedPhrase).then(function(translation){
                //console.log('just translated it')
                this.currPhrase.translation = translation;
                let card = {};

                let adj = this.currPhrase.adj;
                let noun = this.currPhrase.noun;
                let prep = this.currPhrase.prep;

                let sourceContent = "'"+prep.name+"'+'";
                if(adj){
                    sourceContent += adj;
                    if(noun){
                        sourceContent+= " ";
                    }
                }
                if(noun){
                    sourceContent += noun + "'=?";
                }

                let endContent = this.currPhrase.declinedPhrase;

                card.front = {
                    subcontents: [
                        {
                            name: 'Case',
                            value: this.currPhrase.padex
                        },
                        {
                            name: 'Gender',
                            value: this.currPhrase.gender
                        },
                        {
                            name: 'Plurality',
                            value: this.currPhrase.plurality
                        }
                    ],
                    content: sourceContent
                };

                card.back = {
                    subcontents: [
                        {
                            name: 'Translation',
                            value: this.currPhrase.translation
                        }
                    ],
                    content: endContent
                };

                let user = account.getUser();
                if(user){

                    cardFactory.addCard(card,user,'declension').then(function(res){
                        if(res.statusCode=='200'){

                            card.markup={
                                expanded: false,
                                flipped: false
                            };

                            this.cards.push(card);
                            this.clearToInitial();

                        }else{
                            console.log('uh oh, apparent malfunction in adding card!');
                        }

                    }.bind(this));
                }else{

                    card.markup={
                        expanded: false,
                        flipped: false
                    };

                    this.cards.push(card);
                    this.clearToInitial();

                }


            }.bind(this));
        }.bind(this));
    };

    this.openMenu = function($mdMenu,ev){
        $mdMenu.open(ev);
    };

    this.showWaitSpin = false;
    this.inputsFresh = true;

    this.disableDecline= function(){
        let a = this.inputsFresh;
        let b = this.validInputs('adj')||this.validInputs('noun');

        if(!(a&&b)){
            return true;
        }else{
            return false;
        }

    };

    //function to determine expected gender,
    //so if user picks мой and says F, then we'll mention there's probably an issue

    this.checkGender = function(word,PoS){

        console.log('checking for gender');
        let gender;
        if(PoS=='noun'){
            if(this.currPhrase.nounException!='default'){
                console.log(this.currPhrase.nounException.gender);
                if(this.currPhrase.nounException.gender){
                    gender = this.currPhrase.nounException.gender;
                    this.currPhrase.gender = gender;
                }else{
                    console.log('no gender found');
                    gender = '';
                }

            }else{
                console.log('no nounexception yet');
                gender = '';
            }

            this.nounGender = gender;

        }else if(PoS=='adj'){
            if(this.currPhrase.adjException.word!='default'){
                console.log(this.currPhrase.adjException);

                if(this.currPhrase.adjException.gender){
                    gender = this.currPhrase.adjException.gender;
                    this.currPhrase.gender = gender;
                    this.adjGender = gender;
                    return; //this isn't good code structure Sean, step it up
                }

            }

            console.log('no adj exception yet');
            gender = spellingRules.genericAdjGender(word);

            if(gender){
                this.currPhrase.gender = gender;
            }

            this.adjGender = gender;
        }
    };

    this.genderKnown = function(){
        return !!(this.adjGender||this.nounGender);
    };

    this.checkAnimate = function(exception){
        //we can only tell if a word is animate if it's a specific exception case we know about
        if(typeof exception !== null){
            this.nounAnimate = exception.animate;
        }else{
            this.nounAnimate = '';
        }
    };

    this.animateKnown = function(){

        return !!(this.nounAnimate);
    };

    this.currPhrase.gender = '';
    //basically overloading '==' for genders
    //if either one is null, it's true
    this.sameGender = function(gender1,gender2){

        if(gender1==gender2){
            return true;
        }else if(!gender1||!gender2){
            return true;
        }else{
            return false;
        }
    };

    this.validInputs = function(currPoS){
        if(this.currPhrase.padex){
            if(this.currPhrase.padex=='винительный'){
                return !!(currPoS&&this.currPhrase.gender&&this.currPhrase.animate&&this.currPhrase.plurality);
            }else{
                return !!(currPoS&&this.currPhrase.gender&&this.currPhrase.plurality);
            }
        }else{
            return false;
        }
    };

});
