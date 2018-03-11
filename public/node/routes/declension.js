const express = require('express');
const router = express.Router();

const translate = require('google-translate-api')
const decliner = require('../mongo/decliner.js')

router.get('/prepositions',function(req,res){
    var options = {
        db: 'ru',
        collection: 'prepositions'
    }
    decliner.getPrepositions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/labels',function(req,res){

    let lang = req.params.lang
    var options = {
        lang: req.params.lang,
        db: 'ru',
        collection: 'labels'
    }

    decliner.getLabels(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});


router.get('/ruleGroups',function(req,res){
    let options = {
        db: 'ru',
        collection: 'ruleGroups',
    }

    if (typeof req.query.q !== 'undefined' && req.query.q){
        options.q = req.query.q;
    }else{
        options.q = 'all';
    }

    console.log(options)
    decliner.getRuleGroups(options,function(result){
        console.log('just finished getting the ruleGroup')
        console.log(result)
        console.log('onResult: (' + result.statusCode + ')');
        //res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/translations',function(req,res){

    console.log(req.query.targetLang)
    console.log(req.query.phrase)

    translate(req.query.phrase,{from: 'ru',to: req.query.targetLang}).then(response =>{
        console.log(response.text);
        console.log(response.from.text.autoCorrected)
        res.statusCode = '200'
        res.send(response)
    }).catch(err => {
        console.error(err);
    })

})

router.get('/exceptions',function(req,res){
    var options = {
        db: 'ru',
        query: req.query
    }

    decliner.getExceptions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

router.route('/errorReports')
.get(function(req,res){
    var options = {
        db: 'ru'
    }

    res.set('Content-Type','application/json')

    decliner.getErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')')
        res.statusCode = result.statusCode;
        res.send(result);
    })
})
.post(function(req,res){
    var body = req.body
    res.set('Content-Type','application/json')

    console.log(req.body)

    var options = {
        body: body,
        db: 'ru'
    }

    decliner.postErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result); //i'm not even sure what I should be sending back for POST requests
    })
})

router.route('/testResults')
.get(function(req,res){
    var options = {
        db: 'ru'
    }

    res.set('Content-Type','application/json')

    decliner.getTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')')
        res.statusCode = result.statusCode;
        res.send(JSON.stringify(result,null,4));
    })
})
.post(function(req,res){
    var body = req.body
    res.set('Content-Type','application/json')

    console.log(req.body)

    var options = {
        body: body,
        db: 'ru'
    }

    decliner.postTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

module.exports = router;
