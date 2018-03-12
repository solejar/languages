describe('sharedProps factory',function(){
    var sharedProps;

    beforeEach(angular.mock.module('lang'))
    beforeEach(inject(function(_sharedProps_){
        sharedProps = _sharedProps_;
    }))

    it('should be defined',function(){
        expect(sharedProps).toBeDefined();
    })

    it('should contain the following functions',function(){
        expect(sharedProps.getProperty).toBeDefined();
        expect(sharedProps.setProperty).toBeDefined();
        expect(sharedProps.httpReq).toBeDefined();
    })
})
