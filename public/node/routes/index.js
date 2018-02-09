var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var translate = require('google-translate-api')

var rest = require('../getJSON.js') //this is a manual rest implementation because i am a sorry man who does not understand express
var mongo = require('../mongo.js')

router.get('/ru',function(req,res){
    res.render('index.html');
});

router.get('/en',function(req,res){
    res.render('index.html');
})

router.get('/ru/prepositions',function(req,res){
    var options = {
        db: 'ru'
    }
    mongo.getPrepositions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

//not that it really matters but eventually this should be generalized to a regex
router.get('/ru/labels',function(req,res){
    var options = {
        lang: 'ru',
        db: 'ru'
    }
    mongo.getLabels(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/en/labels',function(req,res){
    var options = {
        lang: 'en',
        db: 'ru'
    }
    mongo.getLabels(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        
        res.send(result);
    });
});


router.get('/ru/ruleGroups',function(req,res){
    if (typeof req.query.q !== 'undefined' && req.query.q){
        var options = {
            db: 'ru',
            q: req.query.q
        }
    }else{
        var options = {
            db: 'ru',
            q: 'all'
        }
    }
    

    console.log(options)
    mongo.getRuleGroups(options,function(result){
        console.log('just finished getting the ruleGroup')
        console.log(result)
        console.log('onResult: (' + result.statusCode + ')');
        //res.statusCode = result.statusCode;
        res.send(result);
    });
});

router.get('/ru/translations',function(req,res){

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

router.get('/ru/exceptions',function(req,res){
    var options = {
        db: 'ru',
        query: req.query
    }

    mongo.getExceptions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

router.get('/ru/testResults',function(req,res){
    var options = {
        db: 'ru'
    }

    res.set('Content-Type','application/json')

    mongo.getTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')')
        res.statusCode = result.statusCode;
        res.send(JSON.stringify(result,null,4));
    })

    
})

router.get('/ru/errorReports',function(req,res){
    var options = {
        db: 'ru'
    }

    res.set('Content-Type','application/json')

    mongo.getErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')')
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

router.post('/ru/errorReports',function(req,res){
    var body = req.body
    res.set('Content-Type','application/json')

    console.log(req.body)

    var options = {
        body: body,
        db: 'ru'
    }

    mongo.postErrorReports(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result); //i'm not even sure what I should be sending back for POST requests
    })
})



router.post('/ru/testResults',function(req,res){
    var body = req.body
    res.set('Content-Type','application/json')

    console.log(req.body)

    var options = {
        body: body,
        db: 'ru'
    }

    mongo.postTestResults(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

router.get('/login',function(req,res){
    var options = {
        db: 'users',
        loginInfo: req.query
    }

    mongo.loginUser(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

router.post('/signup',function(req,res){
    var options = {
        db: 'users',
        loginInfo: req.query
    }

    mongo.signinUser(options,function(result){
        console.log('onResult: ('+ result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    })
})

module.exports = router;