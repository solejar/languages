var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

exports.postErrorReports = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('errorReports')

        var reportObj = options.body
        collection.insertOne(reportObj,function(err,res){
            if(err){onResult({'statusCode': '400','errMsg': err})}
            console.log("1 document inserted")
            
            var response = {
                'statusCode': '200',
                'content': {'nInserted': 1}
            }

            onResult(response)

            database.close();
        });
    })
}

exports.getErrorReports = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('errorReports')

        collection.find().project({}).toArray(function(err,items){
        //collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                )
            }
            
            var content = items //return that one element
            var response = {
                'statusCode': '200',
                'content': content
            }
            console.log(content)
            onResult(response)
            database.close();    
        });
    })
}

exports.postTestResults = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('testResults')

        var testResultObj = options.body
        collection.insertOne(testResultObj,function(err,res){
            if(err){onResult({'statusCode': '400','errMsg': err})}
            console.log('one set of test inserted!')

            var response = {
                'statusCode': '200',
                'content': {'nInserted': 1}
            }

            onResult(response)

            database.close();
        })
    })
}

exports.getTestResults = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('testResults')

        collection.find().project({}).toArray(function(err,items){
        //collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                )
            }
            
            var content = items //return that one element
            var response = {
                'statusCode': '200',
                'content': content
            }
            console.log(content)
            onResult(response)
            database.close();    
        });
    })
}

exports.getExceptions = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400', 'errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('exceptions')

        collection.find().project({exceptions: 1}).toArray(function(err,items){
            if(err){
                onResult(
                    {'statusCode': '400','errMsg': err}
                )
            }

            
            
            if(typeof options.query.q !=='undefined' && options.query.q){

                var exceptionsDict = items[0].exceptions
                var word = options.query.q
                if(exceptionsDict.hasOwnProperty(word)){
                    var content = exceptionsDict[word]

                }else{
                    var content = exceptionsDict['default']
                }

            }else{
                var content = items[0].exceptions //i'm not really sure if this default makes sense
            }

            var response = {
                'statusCode': '200',
                'content': content
            }

            console.log(content)

            onResult(response)
            database.close()
        })
    })
}

exports.getRuleGroups = function(options,onResult){
    console.log('this function was called once')
    MongoClient.connect(url,function(err,database){
        if(err){onResults({'statusCode': '400', 'errMsg': err})}

        var db = database.db(options.db);
        var collection = db.collection('ruleGroups')

        if(options.q=='all'){
            collection.find().project({ruleGroups: 1}).toArray(function(err,items){
                if(err){
                    onResult({'statusCode': '400','errMsg': err})
                }

                var content = items[0].ruleGroups
                //console.log('all acquired')
                //console.log(content)
                var response = {
                    'statusCode': '200',
                    'content': content
                }

                onResult(response)
                database.close()
                
            })
        }else{
            var projection = "ruleGroups." + options.q
            var params = {}
            params[projection] = 1
            //console.log(projection)
            collection.find().project(params).toArray(function(err,items){
                if(err){
                    onResult({'statusCode': '400', 'errMsg': err})
                }

                //console.log('why am I here')
                var content = items[0].ruleGroups

                var response = {
                    'statusCode': '200',
                    'content': content
                }
                
                //console.log(content)

                onResult(response)
                database.close()
                
            })
        }

        

    })
}

exports.getPrepositions = function(options,onResult){

    MongoClient.connect(url,function(err,database){
        if (err) {onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('prepositions')

        //returns only preposition field, so we have one element (russian is only object)
        //and prep and id as only fields, need to specify query as blank
        collection.find().project({prepositions: 1}).toArray(function(err,items){
        //collection.find().toArray(function(err,items){
            if (err) {
                onResult(
                    {'statusCode': '400','errMsg': err }
                )
            }
            
            var content = items[0].prepositions //return that one element
            var response = {
                'statusCode': '200',
                'content': content
            }
            console.log(content)
            onResult(response)
            database.close();    
        });
    });
}

exports.getLabels = function(options,onResult){
    MongoClient.connect(url,function(err,database){
        if(err){onResult({'statusCode': '400','errMsg': err})}
        var db = database.db(options.db);
        var collection = db.collection('labels');

        collection.find().project({labels: 1}).toArray(function(err,items){
            if(err){
                onResult(
                    {'statusCode': '400','errMsg': err}
                )
            }

            if(typeof options.lang !=='undefined' &&options.lang){
                var labelsDict = items[0].labels
                if(labelsDict.hasOwnProperty(options.lang)){
                    var content = items[0].labels[options.lang]
                }else{
                    var content = items[0].labels['ru']
                }
            }else{
                var content = items[0].labels['ru'] //this is default
            }
            console.log(content);
            
            var response = {
                'statusCode': '200',
                'content': content
            }
            onResult(response)
            database.close();
        });
    });
}

