describe('this module has the tools to decline a word or phrase',function(){
    var decliner;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_decliner_){
        decliner = _decliner_;
    }));

    it('should be defined',function(){
        expect(decliner).toBeDefined();
    })

    it('should contain the following functions',function(){
        expect(decliner.declinePhrase).toBeDefined();
        expect(decliner.declineWord).toBeDefined();
        expect(decliner.determineRuleSet).toBeDefined();
        expect(decliner.checkException).toBeDefined();
        expect(decliner.applyEnding).toBeDefined();
    });
})
