var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, spellingRules, decliner, translator, $q, $timeout, $window, account){

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

        account.loadCards() //this shouldn't be necessary!!!!

        let cards = account.getCards();
        console.log(cards);
        if(cards){
            this.cards = cards.map(function(card){
                let cardContainer = {
                    _id: card._id,
                    content: card.content,
                    meta: card.meta,
                    markup: {}
                };

                return cardContainer;
            });
        }

        var urlPath = $window.location.href;
        var pathSplit = urlPath.split('/')
        console.log(pathSplit[3])
        var options = {
            //lang: pathSplit[3]
            lang: 'en' //not necessarily sure how tenable a multi language view is at this stage of dev, so just spoof 'en'
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
        //promises.push(account.loadCards())

        //async timeout until all promise completion
        $q.all(promises).then(function(res){
            //set data structs equal to responses
            this.labels = res[0].content;
            this.prepositions = res[1].content;

            deferred.resolve('200');

        }.bind(this));

        return deferred.promise
    }
    //clear out select vals
    this.clearToInitial = function(){

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

    /*this.saveCard = function(card,user){
        console.log(card.saved)
        if(card.saved == true){
            card.saved = false
            account.removeCard(card)

        }else{
            card.saved = true;
            account.addCard(card)
        }
    }*/

    //need to consolidate screen removal with account removal
    this.removeCard = function(card){

        account.removeCard(card).then(function(res){
            account.getCards().then(function(cards){
                this.cards = cards.map(function(card){
                    let cardContainer = {
                        _id: card._id,
                        content: card.content,
                        meta: card.meta,
                        markup: {}
                    };

                    return cardContainer;
                })
            }.bind(this))
        }.bind(this))

    }

    this.markCard = function(card){
        account.markCard(card)
    }

    //WIP
    //maybe we need to look at a generic card template before we can decide how to do this
    this.reportCard = function(card){
        var data = {}
        data['currPhrase'] = card.phrase
        data['cardOptions'] = {stars: card.stars,expanded: card.expanded, saved: card.saved}

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
        //console.log('generating a card');
        decliner.declinePhrase(this.currPhrase).then(function(declinedPhrase){
            //console.log('just declined it');
            this.currPhrase.declinedPhrase = declinedPhrase
            translator.translatePhrase(declinedPhrase).then(function(translation){
                //console.log('just translated it')
                this.currPhrase.translation = translation
                var card = {}
                card.content = this.currPhrase;
                card.meta = {}

                account.addCard(card).then(function(res){
                    //console.log('just added that card to db')
                    if(res.statusCode=='200'){
                        card.markup = {
                            expanded: false
                        };

                        this.cards.push(card);
                        //console.log(this.cards);
                    }else{
                        console.log('uh oh, apparent malfunction in adding card!');
                    }

                }.bind(this))

            }.bind(this))
        }.bind(this))
    }

    this.openMenu = function($mdMenu,ev){
        $mdMenu.open(ev);
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
                    var gender = this.currPhrase.adjException.gender
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

});
