angular.module('lang').controller('deckCtrl',function(account,cardFactory){
    this.changeCardFocus = function(card){
        card.markup.expanded = !card.markup.expanded;

    };

    this.pruneMarkup = function(card){
        let result = {
            _id: card._id,
            user_id: card.user_id,
            content: card.content,
            meta: card.meta
        };

        return result;
    };

    this.editCard = function(card){
        if (account.getUser()){
            let saveCard = this.pruneMarkup(card);
            console.log('about to save info for card: ',saveCard);
            cardFactory.editCard(saveCard);
        }
    };

    this.enableEditMode = function(card){
        if (account.getUser()){
            if(card.markup.edit){ //if card already in edit don't show button
                return false;
            }else{
                return true;
            }

        }else{
            return false;
        }
    };

    this.editModeSwap = function(card){
        card.markup.edit= !card.markup.edit;
    };

    this.saveEdits = function(card){
        this.editCard(card);
        card.markup.edit = !card.markup.edit;

    };

    this.starCard = function(card){
        card.meta.starred = !card.meta.starred;

        if(account.getUser()){
            this.editCard(card);
        }

    };

    //need to consolidate screen removal with account removal
    this.removeCard = function(array,index){

        if(account.getUser()){
            let card = array[index];
            cardFactory.removeCard(card).then(function(res){
                if(res.statusCode=='200'){
                    array.splice(index,1);
                    //just splice it out of the array, don't really feel like reuploading the list redundantly
                }
            }.bind(this));
        }else{
            array.splice(index,1);
        }


    };
});
