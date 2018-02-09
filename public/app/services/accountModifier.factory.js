var app = angular.module('lang')

app.factory('accountModifier',function(){
    return{
        removeCard: function(card,user){
            return 1
        },
        addCard: function(card,user){
            return 2
        }
    }
})