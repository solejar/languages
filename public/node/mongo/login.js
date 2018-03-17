const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

exports.findUser = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        collection.find(options.userInfo).project().toArray(function(err,items){

            console.log(items);

            let response;
            if(items){
                response = {
                    statusCode: '200',
                    content: items
                };
            }else{
                console.log('some error');
                response = {
                    statusCode: '400',
                    errMsg: 'Some error happened'
                };
            }

            onResult(response);
            database.close();
        });
    });
};

exports.insertUser = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('users');

        collection.insertOne(options.loginInfo,function(err,res){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }
            console.log("1 document inserted");

            let response = {
                'statusCode': '200',
                'content': {"nInserted": "1"}
            };

            onResult(response);

            database.close();
        });
    });
};

exports.editUser = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        let query = {
            _id: mongo.ObjectID(options._id)
        };

        let newValues = { $set: options.newUserInfo};
        //do some query
        collection.findOneAndUpdate(query,newValues,function(err,documents){
            if(err) throw err;
            console.log('1 document updated');
            database.close();
            onResult({'statusCode': '200','content': documents[0]});
        });

    });
}
