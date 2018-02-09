var app = angular.module('lang')

//this factory is responsible for modifying a user's card collection
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