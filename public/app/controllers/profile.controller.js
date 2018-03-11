var app = angular.module('lang');

//controller to handle the profile page
app.controller('profileCtrl',function(account,sharedProps){
    this.logout = function(){
        account.logout()
        sharedProps.setProperty('currPage','login')
    }

    this.editUser = function(userID,newInfo){
        console.log('editing user')

        account.editUser(newInfo).then(function(editedUser){
            account.setUser(editedUser);
        })

    }

    this.changePassword = function(newPassword){
        let newInfo = {
            password: newPassword
        }

        let _id = account.getUser()._id;

        this.editUser(_id,newInfo);
    }

    this.removeUser = function(){
        var user = account.getUser();

        account.removeUser(user).then(function(result){
            if(result.statusCode=='200'){
                this.logout();
            }else{
                console.log('something went wrong with user deletion')
            }
        })

    }

    this.getUser = function(){
        return account.getUser();
    }
})
