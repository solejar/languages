var express = require('express');
var bodyParser = require("body-parser")
var jwt = require('jsonwebtoken');

var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'laser-cats';

var strategy = new JwtStrategy(jwtOptions,function(jwt_payload,next){
    console.log('payload received', jwt_payload);

    var options = 
    mongo.findUser(options,function(result){
        if(result.statusCode='200'){
            next(null,result);
        }else{
            next(null,false)
        }
    })
})

passport.use(strategy);

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

router.get('/user',function(req,res){
    if (req.query.userName){
        var options = {
            db: 'app',
            userInfo: {
                userName: req.query.userName
            }
        }

        mongo.findUser(options,function(result){
            if (result.statusCode =='200'){
                res.statusCode = '200'
                res.send(result)
            }else{
                res.statusCode = '400'
                res.send(result)
            }
        })
    }
});

router.post('/login',function(req,res){

    res.set('Content-Type','application/json')

    if(req.body.name && req.body.password){
        var name = req.body.name;
        var password = req.body.password

        var options = {
            db: 'app',
            userInfo: {
                userName: name,
                password: password
            }
        }

        mongo.findUser(options,function(result){
            //console.log('onResult: (' + result.statusCode + ')');
            var response = {}
            if(result.statusCode=='400'){
                console.log('user not found')
                res.statusCode = '400'
                response.statusCode = '400'
                response.errMsg = 'no such user found'
            }else{
                var user = result.content[name] //parse response
                if(user.password===req.body.password){
                    var payload = {id: user.userName};
                    var token = jwt.sign(payload,jwtOptions.secretOrKey);
                    res.statusCode = '200'
                    response.statusCode ='200'
                    response.content = {}
                    response.content.token = token;

                }else{
                    response.statusCode = '400'
                    res.statusCode='400'
                    response.errMsg = 'passwords did not match'
                }
            }
            res.send(response);
        })
    }else{
        console.log(req.body)
        var result = {}
        result.statusCode = '400'
        result.errMsg = 'Need to supply name and password'
        res.send(result)
    }

    
})

router.get('/secret',passport.authenticate('jwt',{session: false}),function(req,res){
    res.statusCode = '200'

    console.log('successfully authenticated a request')

    res.send({statusCode: '200',content : {message: 'you accessed a protected route!'}})
});

router.post('/signup',function(req,res){
    //Account.register(new Account({username: req.body}))
    var account = req.body
    account.isAdmin = false
    account.signupDate = 'today'
    //and whatever other relevant info

    var options = {
        db: 'app',
        loginInfo: account
    }

    mongo.signupUser(options,function(result){
        console.log('onResult: ('+ result.statusCode + ')');
        res.statusCode = result.statusCode;

        res.send(result);
    })
})

module.exports = router;