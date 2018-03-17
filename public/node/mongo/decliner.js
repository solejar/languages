const MongoClient = require('mongodb').MongoClient;

exports.postErrorReports = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection('errorReports');

        let reportObj = options.body;
        collection.insertOne(reportObj,function(err,res){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }
            console.log("1 document inserted");

            let response = {
                'statusCode': '200',
                'content': {'nInserted': 1}
            };

            onResult(response);

            database.close();
        });
    });
};

exports.getErrorReports = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('errorReports');

        collection.find().project({}).toArray(function(err,items){
        //collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                );
            }

            let content = items; //return that one element
            let response = {
                'statusCode': '200',
                'content': content
            };
            //console.log(content)
            onResult(response);
            database.close();
        });
    });
};

exports.postTestResults = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection('testResults');

        let testResultObj = options.body;
        collection.insertOne(testResultObj,function(err,res){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }
            console.log('one set of test inserted!');

            let response = {
                'statusCode': '200',
                'content': {'nInserted': 1}
            };

            onResult(response);

            database.close();
        });
    });
};

exports.getTestResults = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('testResults');

        collection.find().project({}).toArray(function(err,items){

            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                );
            }

            let content = items; //return that one element
            let response = {
                'statusCode': '200',
                'content': content
            };

            //console.log(content)
            onResult(response);
            database.close();
        });
    });
};

exports.getExceptions = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400', 'errMsg': err});
        }
        const db = database.db(options.db);
        const collection = db.collection('exceptions');

        collection.find().project({exceptions: 1}).toArray(function(err,items){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }

            let content;

            if(typeof options.query.q !=='undefined' && options.query.q){

                let exceptionsDict = items[0].exceptions;
                let word = options.query.q;

                if(exceptionsDict.hasOwnProperty(word)){
                    content = exceptionsDict[word];
                }else{
                    content = exceptionsDict['default'];
                }

            }else{
                content = items[0].exceptions; //i'm not really sure if this default makes sense
            }

            let response = {
                'statusCode': '200',
                'content': content
            };

            //console.log(content)

            onResult(response);
            database.close();
        });
    });
};

exports.getRuleGroups = function(options,onResult){
    console.log('this function was called once');
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResults({'statusCode': '400', 'errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('ruleGroups');

        if(options.q=='all'){
            collection.find().project({ruleGroups: 1}).toArray(function(err,items){
                if(err){
                    onResult({'statusCode': '400','errMsg': err});
                }

                let content = items[0].ruleGroups;

                let response = {
                    'statusCode': '200',
                    'content': content
                };

                onResult(response);
                database.close();

            });
        }else{
            let projection = "ruleGroups." + options.q;
            let params = {};
            params[projection] = 1;
            //console.log(projection)
            collection.find().project(params).toArray(function(err,items){
                if(err){
                    onResult({'statusCode': '400', 'errMsg': err});
                }

                //console.log('why am I here')
                let content = items[0].ruleGroups;

                let response = {
                    'statusCode': '200',
                    'content': content
                };

                onResult(response);
                database.close();

            });
        }
    });
};

exports.getPrepositions = function(options,onResult){
    //console.log('prep options:',options);
    MongoClient.connect(options.url,function(err,database){
        if (err) {
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('prepositions');

        //returns only preposition field, so we have one element (russian is only object)
        //and prep and id as only fields, need to specify query as blank
        collection.find().project({prepositions: 1}).toArray(function(err,items){
            if (err) {
                onResult({'statusCode': '400','errMsg': err });
            }

            let content = items[0].prepositions; //return that one element
            let response = {
                'statusCode': '200',
                'content': content
            };

            onResult(response);
            database.close();
        });
    });
};

exports.getLabels = function(options,onResult){
    MongoClient.connect(options.url,function(err,database){
        if(err){
            onResult({'statusCode': '400','errMsg': err});
        }

        const db = database.db(options.db);
        const collection = db.collection('labels');

        collection.find().project({labels: 1}).toArray(function(err,items){
            if(err){
                onResult({'statusCode': '400','errMsg': err});
            }

            let labelsDict = items[0].labels;
            let content = labelsDict.en; //default

            if(typeof options.lan !=='undefined'){
                if(labelsDict.hasOwnProperty(options.lang)){
                    content = labelsDict[options.lang];
                }
            }

            console.log(content);

            let response = {
                'statusCode': '200',
                'content': content
            };
            onResult(response);
            database.close();
        });
    });
};
