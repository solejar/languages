describe('this factory handles general props, and http requests',function(){
    var sharedProps;

    beforeEach(angular.mock.module('lang'))
    beforeEach(inject(function(_sharedProps_){
        sharedProps = _sharedProps_;
    }))

    it('should contain the following functions',function(){
        expect(sharedProps).toBeDefined();
        expect(sharedProps.getProperty).toBeDefined();
        expect(sharedProps.setProperty).toBeDefined();
        expect(sharedProps.httpReq).toBeDefined();
    })
})
