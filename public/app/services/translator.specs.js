describe('this module handles translation and dictionary lookups',function(){
    var translator;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_translator_){
        translator = _translator_
    }))

    it('should contain the following function',function(){
        expect(translator.translatePhrase).toBeDefined();
    })
})