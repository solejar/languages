var mongo = require('mongodb')
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";

exports.findUser = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }
        var db = database.db(options.db);
        var collection = db.collection(options.collection);

        collection.find(options.userInfo).project().toArray(function(err,items){

            console.log(items)

            if(items){
                var response = {
                    statusCode: '200',
                    content: items
                }
            }else{
                console.log('some error')
                var response = {
                    statusCode: '400',
                    errMsg: 'Some error happened'
                }
            }

            onResult(response)
            database.close();
        })
    })
}

exports.findUserID = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }
        var db = database.db(options.db);
        var collection = db.collection('users');

        var o_id = mongo.ObjectID(options._id);

        collection.find({_id: o_id}).project().toArray(function(err,items){

            var statusCode = '200'
            console.log(items)
            var content = items[0]

            if(content){
                var response = {
                    statusCode: statusCode,
                    content: content
                }
            }else{
                console.log('no user found')
                var response = {
                    statusCode: '400',
                    errMsg: 'No such user found'
                }
            }

            onResult(response)
            database.close();
        })
    })
}

exports.insertUser = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }
        var db = database.db(options.db);
        var collection = db.collection('users');
        collection.insertOne(options.loginInfo,function(err,res){
            if(err){onResult({'statusCode': '400','errMsg': err})}
            console.log("1 document inserted")

            var response = {
                'statusCode': '200',
                'content': {"nInserted": "1"}
            }

            onResult(response)

            database.close();
        });
    })
}

exports.editUser = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err})
        }
        var db = database.db(options.db);
        var collection = db.collection(options.collection);

        var query = {
            _id: mongo.ObjectID(options._id)
        }

        var newValues = { $set: options.newUserInfo};
        //do some query
        collection.updateOne(query,newValues,function(err,res){
            if(err) throw err;
            console.log('1 document updated');
            database.close();
            onResult({'statusCode': '200','nUpdated': '1'})
        })

    })
}
