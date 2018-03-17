//this factory handles phrase/word translation
angular.module('lang').factory('translator',function(sharedProps,$q){
    const obj = {};

    //this function translates a phrase
    obj.translatePhrase = function(phrase){
        const deferred = $q.defer();

        let options = {
            url: 'declension/translations',
            params: {
                phrase: phrase,
                targetLang: this.targetLang
            },
            method: 'GET',
            verbose: false
        };

        sharedProps.httpReq(options).then(function(res){
            console.log(res);
            deferred.resolve(res.text);

        }.bind(this));

        return deferred.promise;
    };

    return obj;
});
