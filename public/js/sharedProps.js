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
                params: options.params,
                data: options.data
            }).then(function mySuccess(response){
                if(options.verbose){
                    console.log('the request of' + path+options.url + ' with params: ' + options.params.q + 'went well!');
                    console.log(response.data)
                }
                return response.data;
            },function myError(response){
                console.log('the function failed horribly');
                console.log(response.statusText);
            })
        }
    }
});