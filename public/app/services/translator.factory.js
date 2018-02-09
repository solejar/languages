var app = angular.module('lang')

app.factory('translator',function(sharedProps,$q){
    var obj = {}

    obj.translatePhrase = function(phrase){
        var deferred = $q.defer()

        var options = {
            url: 'ru/translations',
            params: {
                phrase: phrase,
                targetLang: this.targetLang
            },
            method: 'GET',
            verbose: false
        }

        sharedProps.httpReq(options).then(function(res){
            deferred.resolve(res.text)
            console.log(res)
        }.bind(this))

        return deferred.promise
    }
    
    return obj
})