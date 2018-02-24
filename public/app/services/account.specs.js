describe('this module modifies a users card collection',function(){
    var account;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_account_){
        account = _account_;
    }))

    it('should contain the following functions', function(){
        expect(account.removeCard).toBeDefined();
        expect(account.editCard).toBeDefined();
        expect(account.markCard).toBeDefined();
        
    })
})