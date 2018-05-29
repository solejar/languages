angular.module('lang').controller('adminCtrl',function(tester,$mdDialog,sharedProps,account){

    this.testRuleGroups = function(save,compare){

        //this is purely mapped to a button click
        //tester.testGroups(save,compare)
    };

    this.nukeConfirm = function(ev){
        let confirm = $mdDialog.confirm()
            .title('Would you really like to delete all accounts?')
            .textContent('There\'s no going back from here. If you hit that button, you need to be prepared for the consequences.')
            .ariaLabel('accountRemoval')
            .targetEvent(ev)
            .ok('This is the only way')
            .cancel('No, this isn\'t right');

        $mdDialog.show(confirm).then(function(){
            this.nukeAccounts();
            console.log('The deed is done, you monster.');
        }.bind(this), function(){
            console.log('You take a deep breath. \'Who am I to play at God?\', you ask yourself. With newfound resolution, you turn away from the big red button. You don\'t know what the future has in store for you. \'But that\'s not so bad, anyhow.\', you think to yourself as a contented chuckle escapes your lips. \'That\'s not so bad at all.\' ');
        });
    };

    this.nukeAccounts = function(){
        let options = {
            url: '/users',
            method: 'DELETE',
            verbose: true,
        };

        sharedProps.httpReq(options).then(function(result){
            if(result.statusCode=='200'){
                console.log('all accounts nuked succesfully!');
                account.logout();
            }else{ console.log('account removal unsuccessful');  }

        });

    };
});
