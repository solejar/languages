//controller to handle the profile page
angular.module('lang').controller('profileCtrl',function(account,sharedProps,$mdDialog,cardFactory){
    this.logout = function(){
        account.logout();
    };

    this.user = {
        userName:  '',
        settings: {},
        _id: ''
    };

    this.init = function(){
        this.user = account.getUser();
        this.settings = this.user.settings;
        console.log('this users settings are:',this.settings);
    };

    this.changeSettings = function(newSettings){
        let newInfo = {
            settings: newSettings
        };

        let _id  = this.user._id;

        account.editUser(_id,newInfo).then(function(editedUser){
            account.setUser(editedUser);
        });

    };

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

    this.changePassword = function(newPassword){
        let newInfo = {
            password: newPassword
        };

        let _id = this.user._id;

        account.editUser(_id,newInfo).then(function(editedUser){
            account.setUser(editedUser);
        });
    };

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
