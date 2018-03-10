//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

app.controller('footerCtrl',function(){
    this.langs = [
        {display: 'Русский', url: 'ru'},
        {display: 'English', url: 'en'}
    ]
});
