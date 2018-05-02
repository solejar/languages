//this controller is just for page switching on a larger scope.
angular.module('lang').controller('headerCtrl',function($window, account,sharedProps){

    let startingPage = 'login';
    sharedProps.setProperty('currPage',startingPage);

    this.initialLabels = {
        'en': {
            'declension': 'declension',
            'readings': 'readings',
            'study': 'study',
            'about': 'about',
            'profile': 'profile'
        },
        'ru': {
            'declension': 'склонения',
            'readings': 'чтения',
            'study': 'изучение',
            'about': 'о сайте',
            'profile': 'профиль'
        }
    };

    //this function sets the labels on the upper nav bar
    //Russian display isn't fleshed out for whole app however.
    this.setLabels = function(){
        let urlPath = $window.location.href;
        let pathSplit = urlPath.split('/');
        //console.log(pathSplit[3])
        let lang = pathSplit[3];

        this.labels = this.initialLabels[lang];

    };

    this.getUser = function(){
        let user = account.getUser();
        return user;
    };

    this.showAdminTab = function(){
        let user = account.getUser();
        let show = false;

        if(user!={}){
            if(user.isAdmin){
                show = true;
            }
        }
        return show;
    };

    this.isLoggedIn = function(){
        let user = account.getUser();
        let loggedIn;

        if(Object.keys(user).length==0){
            loggedIn = false;
        }else{
            loggedIn = true;
        }

        return loggedIn;
    };

    this.pages = [
        'declension',
        'readings',
        'about',
        'study',
        'login',
        'profile',
        'admin'
    ];

    this.getCurrPage = function(){
        return sharedProps.getProperty('currPage');
    };

    this.changePage = function(newPage){
        if (this.pages.includes(newPage)){
            console.log(newPage);
            sharedProps.setProperty('currPage',newPage);
        }else{
            console.log('woah nelly, you tried switching to a non-existent page!');
        }
    };

});
