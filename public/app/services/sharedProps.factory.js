angular.module('lang').factory('sharedProps',function($http, $location){
    const props = {};

    $http.defaults.headers.post["Content-Type"] = "application/JSON";
    $http.defaults.headers.delete = {"Content-Type": "application/JSON"};

    const path = $location.path(); //this might not be good
    return{
        //these two probably don't need to be in here
        //simple getter
        getProperty: function(whichProperty){
            return props[whichProperty];
        },
        //simple setter
        setProperty: function(whichProperty,whichVal){
            props[whichProperty] = whichVal;
        },
        //I'm not even convinced this part is a good option
        httpReq: function(options){
            console.log(options);
            return $http({
                method: options.method,
                url: path+options.url,
                params: options.params,
                data: options.data
            }).then(function mySuccess(response){
                if(options.verbose){
                    //console.log('the request of' + path+options.url + ' with params: ' + options.params + ' went well!');
                    //console.log(response.data)
                }
                return response.data;
            },function myError(response){
                console.log('the function failed horribly');
                console.log(response.statusText);
                return response.data;
            });
        }
    };
});
