describe('this module modifies a users card collection',function(){
    var account;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_account_){
        account = _account_;
    }))

    it('should be defined',function(){
        expect(account).toBeDefined();
    })

    it('should contain the following functions', function(){
        expect(account.removeCard).toBeDefined();
        expect(account.editCard).toBeDefined();
        expect(account.markCard).toBeDefined();
        expect(account.logout).toBeDefined();
        expect(account.removeUser).toBeDefined();
        expect(account.login).toBeDefined();
        expect(account.setToken).toBeDefined();
        expect(account.getUser).toBeDefined();
        expect(account.setUser).toBeDefined();
        expect(account.editUser).toBeDefined();
        expect(account.register).toBeDefined();
        expect(account.getCards).toBeDefined();

    })
})
