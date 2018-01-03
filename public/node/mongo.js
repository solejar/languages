var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

exports.getPrepositions = function(options,onResult){

    MongoClient.connect(url,function(err,database){
        if (err) {onResult({'statusCode': '400','errMsg': err})}
        var db = database.db('languageDB');
        //var collection =  db.collection("russianPrepositions");
        var collection = db.collection(options.lang)

        //returns only preposition field, so we have one element (russian is only object)
        //and prep and id as only fields, need to specify query as blank
        collection.find().project({prepositions: 1}).toArray(function(err,items){
        //collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                )
            }
            console.log(items);
            var content = items[0] //return that one element
            var response = {
                'statusCode': '200',
                'content': content
            }
            onResult(response)
            database.close();    
        });
    });
}

exports.getDeclensionRules = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db('languageDB');
        var collection = db.collection(options.lang);

        collection.find().project({exceptions: 1,endings: 1}).toArray(function(err,items){
            if(err){
                onResult(
                    {'statusCode': '400','errMsg': err}
                )
            }
            console.log(items);
            var content = items[0]
            var response = {
                'statusCode': '200',
                'content': content
            }
            onResult(response)
            database.close();
        });
    });
}

exports.getLabels = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db('languageDB');
        var collection = db.collection(options.lang);

        collection.find().project({labels: 1}).toArray(function(err,items){
            if(err){
                onResult(
                    {'statusCode': '400','errMsg': err}
                )
            }
            console.log(items);
            var content = items[0]
            var response = {
                'statusCode': '200',
                'content': content
            }
            onResult(response)
            database.close();
        });
    });
}