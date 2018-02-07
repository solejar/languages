describe('spellingRules factory',function(){
    var spellingRules;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_spellingRules_){
        spellingRules = _spellingRules_;
    }));

    it('should exist',function(){
        expect(spellingRules).toBeDefined();
    });
})