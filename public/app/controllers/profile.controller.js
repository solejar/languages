//controller to handle the profile page
angular.module('lang').controller('profileCtrl',function(account,sharedProps){
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
