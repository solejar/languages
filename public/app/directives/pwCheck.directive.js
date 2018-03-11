//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

app.directive('pwCheck',function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var targetModel = attrs.pwCheck;
            ctrl.$validators.pwCheck = function(modelValue){
                if(ctrl.$isEmpty(modelValue)){
                    return true;
                }

                //console.log('directive accessed with: ', attrs.pwCheck,' and: ',modelValue);
                if(modelValue==scope.$eval(targetModel)){
                    return true;
                }else{
                    return false;
                }
            }

            scope.$watch( targetModel, function() {
                ctrl.$validate();
            });

        }
    };
});
