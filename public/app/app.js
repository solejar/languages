(function(){
    var app = angular.module('lang',['ngMaterial']);
    //this basic file is eventually for dependency injection and page control only.

    //this controller is just for page switching on a larger scope.
    app.controller('headerController',function($window, auth,sharedProps){

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

        this.getUser = function(){
            var user = auth.getUser()
            console.log('user',user)
            return user
        }
        
        this.isAdmin = function(){
            var user = auth.getUser()
            if(user){
                if(user.isAdmin){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }

        this.pages = ['declension','readings','about','home','study','login','profile'];

        //this.currPage = 'declension'
        sharedProps.setProperty('currPage','declension')

        this.getCurrPage = function(){
            return sharedProps.getProperty('currPage');
        }

        this.changePage = function(newPage){
            if (this.pages.includes(newPage)){
                console.log(newPage);
                //this.currPage = newPage;
                sharedProps.setProperty('currPage',newPage);
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
    

})();