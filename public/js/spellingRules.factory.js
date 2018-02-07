var app = angular.module('lang');

app.factory('spellingRules',function(){
    return{
        checkSpellingRules: function(word,ending){
            return 'a';   
        }
    }
});