var app = angular.module('lang')

//this factory is responsible for modifying a user's card collection
app.factory('accountModifier',function(){
    var obj = {}

    obj.removeCard= function(card,user){
        return 1
    }

    obj.editCard = function(card,user){
        if(card.saved){
            //edit the card
            return 2;
        }else{
            //add the word
            return 3;
        }
    }
    obj.markCard = function(card,user){
        card.marked= !card.marked
        
        obj.editCard(card,user)

        return 4;
    }

    return obj
})