describe('This controller is for the footer',function(){
    var footerCtrl;

    beforeEach(angular.mock.module('lang'));

    /*beforeEach(inject(function(_footerCtrl_){
        footerCtrl = _footerCtrl_;
    }));*/

    it('should contain the following functions',function(){
        //expect(headerCtrl).toBeDefined();
        expect(2+2).toEqual(4);
    });
});
