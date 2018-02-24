describe('this factory allows controllers to login or signup',function(){
    var auth

    beforeEach(angular.mock.module('lang'))

    beforeEach(inject(function(_auth_){
        auth = _auth_;
    }));

    it('should contain the following the functions',function(){
        expect(auth).toBeDefined()
        expect(auth.attemptLogin).toBeDefined();
        expect(auth.register).toBeDefined();

    })


})
