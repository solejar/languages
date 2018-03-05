var mongo = require('mongodb')
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

exports.editCard = function(options,onResult){

}

exports.deleteCard = function(options,onResult){
  MongoClient.connect(url,function(err,database){
    if(err){
      onResult({'statusCode': '400','errMsg': err})
    }

    var db = database.db(options.db);
    var collection = db.collection(options.collection);

    var card_id = mongo.ObjectID(options._id)

    collection.deleteOne({_id: card_id},function(err,results){
        if(err){
            throw err;
        }else{
            console.log("successfully deleted a card")
        }
        var response = {
            statusCode: '200',
            content: results
        }
        onResult(response)
    });

  })
}

exports.insertCard = function(options,onResult){
    let user_id = mongo.ObjectID(options.card.user_id)
    options.card.user_id = user_id;

    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }

        var db = database.db(options.db);
        var collection = db.collection(options.collection);

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
        var collection = db.collection(options.collection);

        var u_id = mongo.ObjectID(options.user_id)

        console.log('looking for cards with id: ',u_id);
        collection.find({user_id: u_id}).project().toArray(function(err,items){

            console.log(items)
            //var content = items

            if(items){ //this lets zero results be sent back without worry fo throwing errors, potentially revisit this
                console.log('found some cards for current user')
                var response = {
                    statusCode: '200',
                    content: items
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
