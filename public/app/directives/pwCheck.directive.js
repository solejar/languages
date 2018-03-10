//var app = angular.module('lang',['ngMaterial','ngMessages']);
var app = angular.module('lang');

app.directive('pwCheck',function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$validators.pwCheck = function(modelValue){
                    if(ctrl.$isEmpty(modelValue)){
                        return true;
                    }

                    //console.log('directive accessed with: ', attrs.pwCheck,' and: ',modelValue);
                    if(modelValue==attrs.pwCheck){
                        return true;
                    }else{
                        return false;
                    }
            }

            

        }
    };
});
