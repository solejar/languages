describe('this module acts a wrapper for tests with slightly more involved logic.',function(){
    var tester;

    beforeEach(angular.mock.module('lang'));

    beforeEach(inject(function(_tester_){
        tester = _tester_
    }));

    it('should contain the following functions',function(){
        expect(tester.testGroups).toBeDefined();
    })
})