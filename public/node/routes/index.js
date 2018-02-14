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
    //console.log('testing payload strategy');
    console.log('payload received', jwt_payload);

    var options = {
        _id: jwt_payload._id,
        db: 'app'
    }

    login.findUserID(options,function(result){
        if(result.statusCode='200'){
            next(null,result.content);
        }else{
            next(null,false)
        }
    })
})

passport.use(strategy);

var router = express.Router();
var translate = require('google-translate-api')

var rest = require('../getJSON.js') //this is a manual rest implementation because i am a sorry man who does not understand express
var decliner = require('../mongo/decliner.js')
var login = require('../mongo/login.js')

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
    decliner.getPrepositions(options,function(result){
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
    decliner.getLabels(options,function(result){
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
    decliner.getLabels(options,function(result){
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
    decliner.getRuleGroups(options,function(result){
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

    decliner.getExceptions(options,function(result){
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

    decliner.getTestResults(options,function(result){
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

    decliner.getErrorReports(options,function(result){
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

    decliner.postErrorReports(options,function(result){
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

    decliner.postTestResults(options,function(result){
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

        login.findUser(options,function(result){
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

    //res.set('Content-Type','application/json')

    var userName = req.body.userName||req.params.userName;
    var password = req.body.password||req.params.password;

    //console.log(userName)
    //console.log(password)
    console.log(req.data)
    console.log(req.params)
    console.log(req.body)
    
    if(req.body.userName && req.body.password){
        var name = req.body.userName;
        var password = req.body.password

        var options = {
            db: 'app',
            userInfo: {
                userName: name,
                password: password
            }
        }

        login.findUser(options,function(result){
            //console.log('onResult: (' + result.statusCode + ')');
            var response = {}
            if(result.statusCode=='400'){
                console.log('user not found')
                res.statusCode = '400'
                response.statusCode = '400'
                response.errMsg = 'no such user found'
            }else{
                var user = result.content //parse response
                console.log('found user', user)

                if(user.password===req.body.password){
                    var payload = {_id: user._id};
                    var token = jwt.sign(payload,jwtOptions.secretOrKey);
                    res.statusCode = '200'
                    response.statusCode ='200'
                    response.content = {}
                    response.content.user = user;
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
    //NEED A WAY TO GENERATE ID
    //Account.register(new Account({username: req.body}))
    var account = {}
    account.userName = req.body.userName
    account.password = req.body.password
    account.isAdmin = false
    account.signupDate = 'today'
    //account.id = 0
    //and whatever other relevant info

    var options = {
        db: 'app',
        loginInfo: account
    }

    login.insertUser(options,function(result){
        console.log('onResult: ('+ result.statusCode + ')');
        res.statusCode = result.statusCode;
        if(res.statusCode =='200'){
            login.findUser(options,function(user){

                var payload = {_id: user.content._id};
                var token = jwt.sign(payload,jwtOptions.secretOrKey);
                res.statusCode = '200'
                response.statusCode ='200'
                response.content = {}
                response.content.user = user.content
                response.content.token = token;
            })
            
        }
        res.send(result);
    })
})

module.exports = router;