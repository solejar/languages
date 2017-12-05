(function(){
    var app = angular.module('lang',[]);
    //this basic file is eventually for dependency injection and page control only.

    app.controller('pageCtrl',function(){
        this.pages = ['home','russian','japanese','spanish'];
        
        this.currPage = 'russian'
        var changePage = function(newPage){
            if (this.pages.includes(newPage)){
                console.log(newPage);
                this.currPage = newPage;
            }else{
                console.log('woah nelly, you tried switching to a non-existent page!')
            }
        }
    })

})();