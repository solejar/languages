(function(){
    var app = angular.module('lang',['ngMaterial']);
    //this basic file is eventually for dependency injection and page control only.


    //this controller is just for page switching on a larger scope.
    app.controller('headerController',function($window){

        this.initialLabels = {
            'en': {
                'declension': 'declension',
                'readings': 'readings',
                'study': 'study',
                'about': 'about'
            },
            'ru': {
                'declension': 'склонения',
                'readings': 'чтения',
                'study': 'изучение',
                'about': 'о сайте'
            }
        }

        this.setLabels = function(){
            var urlPath = $window.location.href;
            var pathSplit = urlPath.split('/')
            //console.log(pathSplit[3])
            var lang = pathSplit[3]
            
            this.labels = this.initialLabels[lang];

        }

        this.pages = ['declension','readings','about','home','study'];

        this.currPage = 'declension'

        this.changePage = function(newPage){
            if (this.pages.includes(newPage)){
                console.log(newPage);
                this.currPage = newPage;
            }else{
                console.log('woah nelly, you tried switching to a non-existent page!')
            }
        }
    })

    app.controller('footerController',function(){
        this.langs = [
            {display: 'Русский', url: 'ru'},
            {display: 'English', url: 'en'}
        ]
    });

    //maybe move this to another file
    app.filter('prepositionFilter',function(){
        return function(phrase){

            var phraseArr = phrase.split(' ')
            var prep = phraseArr[0]
            var successiveWord = phraseArr[1]!=""? phraseArr[1]: phraseArr[2] 
            var let1 = successiveWord[0]
            var let2 = successiveWord[1]
            if(prep=='о'){
                var vowels = ['э','а','у','э','о','и']
                 
                if(vowels.includes(let1)){
                    prep+='б'
                }
            }else if(prep=='в'||prep=='к'){
                var consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
                if(consonants.includes(let1)&&consonants.includes(let2)){
                    prep+='о'
                }
            }

            phraseArr[0] = prep
            return phraseArr.join(' ')
        }
    })

})();