const express = require('express');
const router = express.Router();

const config = require('../config');
const mongoUrls = config.mongoUrls;

const translate = require('google-translate-api');
const decliner = require('../mongo/decliner');

const db = 'ru'; //every endpoint here is coming from ru db
const mongoUrl = mongoUrls[db];

router.get('/prepositions',function(req,res){

    let options = {
        db: db,
        collection: 'prepositions',
        url: mongoUrl
    };

    decliner.getPrepositions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/labels',function(req,res){

    let options = {
        lang: req.params.lang,
        db: db,
        collection: 'labels',
        url: mongoUrl
    };

    decliner.getLabels(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});


router.get('/ruleGroups',function(req,res){

    let options = {
        db: db,
        collection: 'ruleGroups',
        url: mongoUrl
    };

    if (typeof req.query.q !== 'undefined' && req.query.q){
        options.q = req.query.q;
    }else{
        options.q = 'all';
    }

    console.log(options);
    decliner.getRuleGroups(options,function(result){
        console.log('just finished getting the ruleGroup');
        console.log(result);
        console.log('onResult: (' + result.statusCode + ')');
        //res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/translations',function(req,res){

    console.log(req.query.targetLang);
    console.log(req.query.phrase);

    translate(req.query.phrase,{from: 'ru',to: req.query.targetLang}).then(response =>{
        console.log(response.text);
        console.log(response.from.text.autoCorrected);
        res.statusCode = '200';
        res.send(response);
    }).catch(err => {
        console.error(err);
    });

});

router.get('/exceptions',function(req,res){
    let options = {
        db: db,
        query: req.query,
        url: mongoUrl
    };

    decliner.getExceptions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.route('/errorReports')
.get(function(req,res){
    let options = {
        db: db,
        collection: 'errorReports',
        url: mongoUrl
    };

    res.set('Content-Type','application/json');

    decliner.getErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
})
.post(function(req,res){
    let body = req.body;
    res.set('Content-Type','application/json');

    console.log(req.body);

    let options = {
        body: body,
        db: db,
        collection: 'errorReports',
        url: mongoUrl
    };

    decliner.postErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result); //i'm not even sure what I should be sending back for POST requests
    });
});

router.route('/testResults')
.get(function(req,res){
    let options = {
        db: db,
        collection: 'testResults',
        url: mongoUrl
    };

    res.set('Content-Type','application/json');

    decliner.getTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(JSON.stringify(result,null,4));
    });
})
.post(function(req,res){
    let body = req.body;
    res.set('Content-Type','application/json');

    console.log(req.body);

    let options = {
        body: body,
        db: db,
        collection: 'testResults'
    };

    decliner.postTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

module.exports = router;
