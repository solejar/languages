var mongo = require('mongodb')
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

exports.editCard = function(options,onResult){

}

exports.removeCard = function(options,onResult){
  MongoClient.connect(url,function(err,database){
    if(err){
      onResult({'statusCode': '400','errMsg': err})
    }

    var db = database.db(options.db);
    var collection = db.collection('cards');

    var cardID = new mongodb.ObjectID(options.cardID)；

    collection.deleteOne({_id: cardID},function(err,results){
      if(err){
        throw err;
      }else{
        console.log("successfully deleted a card")
      }
      var response = {
        statusCode: '200',
        content = results
      }
      onResult(response)
    });

  })
}

exports.insertCard = function(options,onResult){
    MongoClient.connect(url,function(err,database){
      if(err){
        onResult({'statusCode': '400','errMsg': err})
      }

      var db = database.db(options.db);
      var collection = db.collection('cards');

      collection.insertOne(options.card,function(err,res){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        console.log("1 card inserted into db")

        var response = {
            'statusCode': '200',
            'content': {"nInserted": "1"}
        }

        onResult(response)

        database.close();
      })
    })
}

exports.getCards = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }
        var db = database.db(options.db);
        var collection = db.collection('cards');

        collection.find({userID: options.userID}).project().toArray(function(err,items){

            var statusCode = '200'
            console.log(items)
            var content = items

            if(content){
                var response = {
                    statusCode: statusCode,
                    content: content
                }
            }else{
                console.log('no card found')
                var response = {
                    statusCode: '400',
                    errMsg: 'No cards found'
                }
            }

            onResult(response)
            database.close();
        })
    })
}
