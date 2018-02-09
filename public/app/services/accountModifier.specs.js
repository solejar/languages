describe('this module modifies a users card collection',function(){
    var accountModifier;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_accountModifier_){
        accountModifier = _accountModifier_;
    }))

    it('should contain the following functions', function(){
        expect(accountModifier.removeCard).toBeDefined();
        expect(accountModifier.editCard).toBeDefined();
        expect(accountModifier.markCard).toBeDefined();
    })
})