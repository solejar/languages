//this is the factory that handles spelling rules
describe('spellingRules factory',function(){
    let spellingRules;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_spellingRules_){
        spellingRules = _spellingRules_;
    }));

    it('should be defined',function(){
        expect(spellingRules).toBeDefined();
    })

    it('should contain the following functions',function(){
        expect(spellingRules.check).toBeDefined();
        expect(spellingRules.getAdjType).toBeDefined();
        expect(spellingRules.genericAdjGender).toBeDefined();
    })
})
