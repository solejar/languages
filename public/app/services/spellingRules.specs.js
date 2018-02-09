describe('spellingRules factory',function(){
    var spellingRules;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_spellingRules_){
        spellingRules = _spellingRules_;
    }));


    it('should contain the following functions',function(){
        expect(spellingRules).toBeDefined();
        expect(spellingRules.check).toBeDefined();
        expect(spellingRules.getAdjType).toBeDefined();
        expect(spellingRules.genericAdjGender).toBeDefined();
    });
})