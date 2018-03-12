angular.module('lang').factory('translator',function(sharedProps,$q){
    const obj = {};

    obj.translatePhrase = function(phrase){
        const deferred = $q.defer();

        let options = {
            url: 'ru/translations',
            params: {
                phrase: phrase,
                targetLang: this.targetLang
            },
            method: 'GET',
            verbose: false
        };

        sharedProps.httpReq(options).then(function(res){
            deferred.resolve(res.text);
            console.log(res);
        }.bind(this));

        return deferred.promise;
    };

    return obj;
});
