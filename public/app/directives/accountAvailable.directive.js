var app = angular.module('lang');

app.directive('accountAvailable',function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var targetModel = attrs.accountAvailable;

            scope.$watch( targetModel, function() {
                //ctrl.$validate();
                ctrl.$setValidity('accountAvailable',scope.$eval(targetModel));
            });


        }
    };
});
