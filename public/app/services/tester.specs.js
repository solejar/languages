describe('Testing factory',function(){
    var tester;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_tester_){
        tester = _tester_
    }));

    it('should be defined',function(){
        expect(tester).toBeDefined();
    })

    it('should contain the following functions',function(){
        expect(tester.testGroups).toBeDefined();
    })
})
