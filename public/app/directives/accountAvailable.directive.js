//This directive sets the validity of the signup fields if an account exists with that name
angular.module('lang').directive('accountAvailable',function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            let targetModel = attrs.accountAvailable;

            scope.$watch( targetModel, function() {
                //ctrl.$validate();
                ctrl.$setValidity('accountAvailable',scope.$eval(targetModel));
            });


        }
    };
});
