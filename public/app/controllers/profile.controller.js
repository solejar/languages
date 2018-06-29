//controller to handle the profile page
angular.module('lang').controller('profileCtrl',function(account,sharedProps,$mdDialog,cardFactory){
    this.logout = function(){
        account.logout();
        cardFactory.clearCurrCards();
    };

    //a function to check if settings equal, to check if forms have changed
    this.areSettingsEqual = function(settings1,settings2){

        //if lengths different, not equal
        if(settings1.length!=settings2.length){
            return false;
        }

        let keys = Object.keys(settings1);

        //if key either doesn't exist twice
        //or value of setting is different, return false
        for(let i = 0;i<keys.length;i++){
            let currKey = keys[i];
            if(!settings2.hasOwnProperty(currKey)){
                return false;
            }

            if(settings2[currKey].value!=settings1[currKey].value){
                return false;
            }
        }

        //else
        return true;
    };

    //local object to store user info
    this.user = {
        userName:  '',
        settings: {},
        _id: ''
    };

    //called on controller init, gets user and settings
    this.init = function(){
        this.user = account.getUser();
        this.newSettings = JSON.parse(JSON.stringify(this.user.settings));
        //console.log('this users settings are:',JSON.parse(JSON.stringify(this.newSettings)));

    };

    //saves settings that have been adjusted by the user
    this.saveSettings = function(newSettings){

        let newInfo = {
            settings: newSettings
        };

        let _id  = this.user._id;

        account.editUser(_id,newInfo).then(function(editedUser){
            console.log(editedUser);
            account.setUser(editedUser);
            //set user settings back to newsettings values
            this.user.settings = JSON.parse(JSON.stringify(newSettings));

        }.bind(this));

    };

    //clear changes to settings in the view
    this.clearSettings = function(){
        this.newSettings = JSON.parse(JSON.stringify(this.user.settings));
    };

    //reset settings to their default values
    this.resetDefaultSettings = function(){
        //save the values first
        this.saveSettings(account.defaultSettings);
        this.newSettings = JSON.parse(JSON.stringify(account.defaultSettings));
    };

    //card deletion dialog
    this.confirmCardDeletion = function(ev){
        let confirm = $mdDialog.confirm()
            .title('Would you really like to delete all your cards?')
            .textContent('There\'s no going back from here. If you hit that button, you need to be prepared for the consequences.')
            .ariaLabel('cardRemoval')
            .targetEvent(ev)
            .ok('Delete cards')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function(){
            let options = {
                url: '/users/cards/',
                method: 'DELETE',
                verbose: true,
                data: {
                    user_id: this.user._id
                }
            };

            sharedProps.httpReq(options,function(res){
                if(res.statusCode =='200'){
                    console.log('cards successfully deleted');
                    cardFactory.clearCurrCards();
                }else{
                    console.log('cards did not delete successfully');
                }
            });

        }.bind(this), function(){
            console.log('user decided against removing their card collection');
        });
    };

    //function to change your password
    this.changePassword = function(newPassword){
        let newInfo = {
            password: newPassword
        };

        let _id = this.user._id;

        account.editUser(_id,newInfo).then(function(editedUser){
            account.setUser(editedUser);
        });
    };

    //function to remove the user (not yet implemented on the front)
    this.removeUser = function(){

        account.removeUser(this.user).then(function(result){
            if(result.statusCode=='200'){
                this.logout();
            }else{
                console.log('something went wrong with user deletion');
            }
        });

    };

});
