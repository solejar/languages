const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const mongo = require('mongodb');
const login = require('../mongo/login');
const account = require('../mongo/account');

//we store db urls in here
const mongoUrls = config.mongoUrls;
const db = 'app'; //every endpoint here is coming from app db
const mongoUrl = mongoUrls[db];

const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = config.app.JWTSecretOrKey;

const strategy = new JwtStrategy(jwtOptions,function(jwt_payload,next){
    console.log('payload received', jwt_payload);

    let options = {
        userInfo: {
            _id: mongo.ObjectID(jwt_payload._id)
        },
        db: db,
        collection: 'users',
        url: mongoUrl
    };

    login.findUser(options,function(result){
        if(result.statusCode=='200'){
            next(null,result.content[0]);
        }else{
            next(null,false);
        }
    });
});

passport.use(strategy);

router.route('/cards')
.get(passport.authenticate('jwt',{session: false}),function(req,res){
    let options = {
        db: db,
        collection: 'cards',
        user_id: req.query.user_id,
        url: mongoUrl
    };

    //console.log(req.query)
    console.log(options);
    account.getCards(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('found some cards');
        }

        res.send(result);
    });
})
.post(passport.authenticate('jwt',{session:false}),function(req,res){
    let options = {
        db: db,
        collection: 'cards',
        card: req.body,
        url: mongoUrl
    };

    console.log(options);
    account.insertCard(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('added a card');
        }
        res.send(result);
    });
})
.delete(passport.authenticate('jwt',{session: false}),function(req,res){
    let options = {
        db: db,
        collection: 'cards',
        _id: req.body._id,
        url: mongoUrl
    };

    console.log('deleting card with id ',req.body);
    account.deleteCard(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('deleted a card!');
        }
        res.send(result);
    });
});

router.route('/')
.get(function(req,res){
    let options = {
        db: db,
        collection: 'users',
        userInfo: {},
        url: mongoUrl
    };

    console.log('query is ',req.query);
    //this is how you make a generic mongo query, seems legit
    if (req.query.userName){
        options.userInfo.userName= req.query.userName;
    }else if(req.query.email){
        options.userInfo.email = req.query.email;
    }

    console.log('getting these users,',options.userInfo);
    login.findUser(options,function(result){
        res.statusCode = result.statusCode;
        res.send(result);
    });
})
.delete(function(req,res){
    //mongo delete
})
.put(function(req,res){
    //mongo edit
    let options = {
        db: db,
        collection: 'users',
        _id: req.body._id,
        newUserInfo: req.body.newUserInfo,
        url: mongoUrl
    };

    login.editUser(options,function(result){
        res.statusCode=result.statusCode;
        if(res.statusCode=='400'){
            console.log('something went wrong with editing the user');
        }
        res.send(result);
    });
})
.post(function(req,res){
    //NEED A WAY TO GENERATE ID
    let account = {
        userName: req.body.userName,
        password: req.body.password,
        isAdmin: false,  //this should never be decided by user
        signupDate: (new Date()).toLocaleDateString(),
        email: req.body.email
    };

    let options = {
        db: db,
        collection: 'users',
        loginInfo: account,
        url: mongoUrl
    };

    let q = {};
    if(options.loginInfo.email){
        q.email = options.loginInfo.email;
    }else if (options.loginInfo.userName){
        q.userName = options.loginInfo.userName;
    }

    let q_options = {
        db: options.db,
        collection: options.collection,
        userInfo: q,
        url: options.url
    };

    login.insertUser(options,function(result){
        console.log('onResult: ('+ result.statusCode + ')');
        res.statusCode = result.statusCode;
        let response = {};
        if(res.statusCode =='200'){
            console.log('looking for user with params,',q_options);
            login.findUser(q_options,function(user){
                console.log('user found',user);
                if (user.content.length==1){
                    console.log();
                    let payload = {_id: user.content[0]._id};
                    let token = jwt.sign(payload,jwtOptions.secretOrKey);
                    res.statusCode = '200';

                    response.statusCode ='200';
                    response.content = {};
                    response.content.user = user.content[0];
                    response.content.token = token;

                    console.log('response of',response);
                    res.send(response);
                }else{
                    console.log('too many users');
                }

            });

        }

    });
});

router.post('/login',function(req,res){

    console.log(req.body);

    if(req.body.userName && req.body.password){

        let options = {
            db: db,
            collection: 'users',
            userInfo: {
                userName: req.body.userName,
            },
            url: mongoUrl
        };

        login.findUser(options,function(result){
            //console.log('onResult: (' + result.statusCode + ')');
            let response = {};
            if(result.statusCode=='400'){
                console.log('user not found');
                res.statusCode = '400';
                response.statusCode = '400';
                response.errMsg = 'no such user found';
            }else{
                //console.log('result of findUser', result.content)
                let user = result.content[0]; //parse response
                console.log('found user', user);

                if(user.password===req.body.password){
                    let payload = {_id: user._id};
                    let token = jwt.sign(payload,jwtOptions.secretOrKey);
                    res.statusCode = '200';
                    response.statusCode ='200';
                    response.content = {};
                    response.content.user = user;
                    response.content.token = token;

                }else{

                    response.statusCode = '401';
                    res.statusCode='401';
                    response.errMsg = 'passwords did not match';
                }
            }
            console.log('sending back this response: ',response);
            res.send(response);
        });
    }else{
        console.log(req.body);
        let result = {};
        result.statusCode = '400';
        result.errMsg = 'Need to supply name and password';
        res.send(result);
    }

});

module.exports = router;
