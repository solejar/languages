var app = angular.module('lang');

app.factory('sharedProps',function(){
    var props = {};

    return{
        //simple getter
        getProperty: function(whichProperty){
            return props[whichProperty];
        },
        //simple setter
        setProperty: function(whichProperty,whichVal){
            props[whichProperty] = whichVal;
        }
    }
});