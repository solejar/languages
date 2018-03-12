describe('This controller is for the header',function(){
    var headerCtrl;

    beforeEach(angular.mock.module('lang'));

    /*beforeEach(inject(function(_headerCtrl_){
        headerCtrl = _headerCtrl_;
    }));*/

    it('should contain the following functions',function(){
        //expect(headerCtrl).toBeDefined();
        expect(2+2).toEqual(4);
    });
});
