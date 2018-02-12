(function(){
    var app = angular.module('lang',['ngMaterial']);
    //this basic file is eventually for dependency injection and page control only.

    //this controller is just for page switching on a larger scope.
    app.controller('headerController',function($window, authenticator){

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

        this.user = {
            userName: 'Sean Olejar',
            isAdmin: false
        }

        this.logout = function(user){
            console.log('logging out user '+user.userName)

            this.user = {}

            this.currPage = 'login'
        }

        this.attemptLogin = function(loginInfo){
            authenticator.attemptLogin(loginInfo).then(function(res){
                if(res.statusCode=='200'){
                    this.user = res.content

                    this.currPage ='profile'
                }else{
                    //some sort of error
                }
            }.bind(this))
            
        }

        this.register = function(loginInfo){
            //something would probably happen here
            loginInfo.isAdmin = false; //or maybe on server side

            authenticator.register(loginInfo).then(function(res){
                if(res.statusCode=='200'){
                    this.user = res.content
                    this.currPage = 'profile'
                }else{
                    //some error
                }
            }.bind(this))
            
        }

        this.isAdmin = function(){
            if(this.user){
                if(this.user.isAdmin){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }

        this.pages = ['declension','readings','about','home','study','login','profile'];

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
    

})();