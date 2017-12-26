var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

exports.getPrepositions = function(options,onResult){

    MongoClient.connect(url,function(err,database){
        if (err) {return console.dir(err);}
        var db = database.db('languageDB');
        var collection =  db.collection("russianPrepositions");

        collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
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