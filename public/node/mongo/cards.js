const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

exports.editCard = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        const _id = mongo.ObjectID(options._id);

        let query = {
            _id: _id
        };

        let newValues = { $set: options.card};

        console.log('query for edit:',query);
        console.log('new values for edit: ',newValues);


        collection.findOneAndUpdate(query,newValues,function(err,documents){
            if(err) throw err;
            console.log('1 document updated');
            database.close();
            onResult({'statusCode': '200','content': documents.value});
        });


    });
};

exports.deleteCardbyID = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        const card_id = mongo.ObjectID(options._id);

        collection.deleteOne({_id: card_id},function(err,results){
            if(err){
                throw err;
            }else{
                console.log("successfully deleted a card");
            }
            let response = {
                statusCode: '200',
                content: results
            };
            onResult(response);
        });

    });
};

exports.deleteCardbyUser = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        const user_id = mongo.ObjectID(options.user_id);

        collection.deleteMany({user_id: user_id},function(err,results){
            if(err){
                throw err;
            }else{
                console.log("successfully deleted a users cards");
            }
            let response = {
                statusCode: '200',
                content: results
            };
            onResult(response);
        });

    });
};

exports.deleteAllCards = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        const card_id = mongo.ObjectID(options._id);

        collection.deleteMany({},function(err,results){
            if(err){
                throw err;
            }else{
                console.log("successfully deleted all cards");
            }
            let response = {
                statusCode: '200',
                content: results
            };
            onResult(response);
        });

    });
};

exports.insertCard = function(options,onResult){
    let user_id = mongo.ObjectID(options.card.user_id);
    options.card.user_id = user_id;

    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        collection.insertOne(options.card,function(err,res){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }
            console.log("1 card inserted into db");
            console.log(res.ops);
            let response = {
                'statusCode': '200',
                'content': {"nInserted": "1"}
            };

            onResult(response);

            database.close();
        });
    });
};

exports.getCards = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection(options.collection);

        const u_id = mongo.ObjectID(options.user_id);

        console.log('looking for cards with id: ',u_id);
        collection.find({user_id: u_id}).project().toArray(function(err,items){

            console.log(items);
            //var content = items
            let response;
            if(items){ //this lets zero results be sent back without worry fo throwing errors, potentially revisit this
                console.log('found some cards for current user');
                response = {
                    statusCode: '200',
                    content: items
                };

            }else{
                console.log('no card found');
                response = {
                    statusCode: '400',
                    errMsg: 'No cards found'
                };
            }

            onResult(response);
            database.close();
        });
    });
};
