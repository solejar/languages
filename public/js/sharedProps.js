var app = angular.module('lang');

app.factory('sharedProps',function($http, $location){
    var props = {};

    var path = $location.path();
    return{
        //simple getter
        getProperty: function(whichProperty){
            return props[whichProperty];
        },
        //simple setter
        setProperty: function(whichProperty,whichVal){
            props[whichProperty] = whichVal;
        },
        httpReq: function(options){
            return $http({
                method: options.method,
                url: path+options.url,
                params: options.params
            }).then(function mySuccess(response){
                console.log('the request went well!');
                return response.data;
            },function myError(response){
                console.log('the function failed horribly');
                console.log(response.statusText);
            })
        }
    }
});