var app = angular.module('lang')

app.controller('loginCtrl',function(sharedProps,auth){3

    this.attemptLogin = function(loginInfo){
        console.log('attempting login')
        auth.attemptLogin(loginInfo).then(function(res){
            //console.log(res)
            if(res.statusCode=='200'){
                //this.user = res.content
                //auth.setUser(res.content)
                sharedProps.setProperty('currPage','profile')
            }else{
                //some sort of error
            }
        }.bind(this))
        
    }

    this.register = function(loginInfo){
        //something would probably happen here
        loginInfo.isAdmin = false; //or maybe on server side

        auth.register(loginInfo).then(function(res){
            if(res.statusCode=='200'){
                //auth.setUser(res.content)
                sharedProps.setProperty('currPage','profile')
            }else{
                //some error
            }
        }.bind(this))
        
    }
});