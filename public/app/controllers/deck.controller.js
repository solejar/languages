angular.module('lang').controller('deckCtrl',function(account,cardFactory){

    //flips card from one side to the other
    this.changeCardFocus = function(card){
        card.markup.expanded = !card.markup.expanded;
        if(!card.markup.expanded){
            card.markup.flipped = false;
        }
    };


    //removes markup elements from cards, as they should not be saved
    this.pruneMarkup = function(card){
        let result = {
            _id: card._id,
            user_id: card.user_id,
            front: card.front,
            back: card.back,
            meta: card.meta
        };

        return result;
    };

    //edits a users card
    this.editCard = function(card){
        if (account.getUser()){
            let saveCard = this.pruneMarkup(card);
            console.log('about to save info for card: ',saveCard);
            cardFactory.editCard(saveCard);
        }
    };

    //determines if card is editable
    this.isEditingEnabled = function(card){
        if (account.getUser()&&card.markup){
            if(card.markup.edit){ //if card already in edit don't show button
                return false;
            }else{
                return true;
            }

        }else{
            return false;
        }
    };

    //save edits to a card to a users account
    this.saveEdits = function(card){
        this.editCard(card.temporary_edits).then(function(result){
            if(result.statusCode=='200'){
                this.editModeSwap(card); //clear out the temporary_edits
                console.log('editing went all well!');
            }
        }.bind(this));


    };

    //switchs a card in/out of edit mode
    this.editModeSwap = function(card,markup){
        card.temporary_edits = {
            user_id: card.user_id,
            _id: card._id,
            front: card.front,
            back: card.back,
            starred: card.starred,
            meta: card.meta
        };
        card.markup.edit = !card.markup.edit;
        card.markup.editFresh = true;

        if(markup=='expand'){
            card.markup.expanded = true;
        }
    };

    this.starCard = function(card){
        card.starred = !card.starred;

        if(account.getUser()){
            this.editCard(card);
        }

    };

    //side must be 'front' or 'back'
    this.addSubcontent = function(card,side){

        let newSubContent = {
            name: '',
            value: ''
        };

        card[side].subcontents.push(newSubContent);
    };

    this.flipCard = function(card){
        card.markup.flipped = !card.markup.flipped;
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
