const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const mongo = require('mongodb');
const usersDB = require('../mongo/users');
const cardsDB = require('../mongo/cards');

//we store db urls in here
const mongoUrls = config.mongoUrls;
const db = 'app'; //every endpoint here is coming from app db
const mongoUrl = mongoUrls[db];

const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = config.app.JWTSecretOrKey;

const baseCardOptions = {
    db: db,
    url: mongoUrl,
    collection: 'cards'
};

const baseUserOptions = {
    db: db,
    collection: 'users',
    url: mongoUrl
};

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

    usersDB.findUser(options,function(result){
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
    let options = baseCardOptions;
    options.user_id = req.query.user_id;

    //console.log(req.query)
    console.log(options);
    cardsDB.getCards(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('found some cards');
        }

        res.send(result);
    });
})
.post(passport.authenticate('jwt',{session:false}),function(req,res){
    let options = baseCardOptions;
    options.card = req.body;

    console.log(options);
    cardsDB.insertCard(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('added a card');
        }
        res.send(result);
    });
})
.delete(passport.authenticate('jwt',{session: false}),function(req,res){

    let options = baseCardOptions;
    if(req.body.user_id){
        options.user_id = req.body.user_id;

        console.log('deleting cards from user: ',req.body);
        cardsDB.deleteCardbyUser(options,function(result){
            res.statusCode = result.statusCode;
            if(result.statusCode=='200'){
                console.log('deleted all of a users cards!');
            }
            res.send(result);
        });
    }else if(req.body._id){
        options._id = req.body._id;

        console.log('deleting card with id ',req.body);
        cardsDB.deleteCardbyID(options,function(result){
            res.statusCode = result.statusCode;
            if(result.statusCode=='200'){
                console.log('deleted a card!');
            }
            res.send(result);
        });
    }

})
.put(passport.authenticate('jwt',{session:false}),function(req,res){
    let options = baseCardOptions;
    options._id = req.body.card_id;
    options.card = req.body.card;

    console.log('card edit values: ',req.body.card);
    console.log('editing card with id ',req.body.card_id);
    cardsDB.editCard(options,function(result){
        res.statusCode = result.statusCode;
        if(result.statusCode=='200'){
            console.log('edit was successful!');

        }else{
            console.log('edit was not successful');
        }
        res.send(result);
    });
});

router.route('/')
.get(function(req,res){
    let options = baseUserOptions;
    options.userInfo = {};

    console.log('query is ',req.query);
    //this is how you make a generic mongo query, seems legit
    if (req.query.userName){
        options.userInfo.userName= req.query.userName;
    }else if(req.query.email){
        options.userInfo.email = req.query.email;
    }

    console.log('getting these users,',options.userInfo);
    usersDB.findUser(options,function(result){
        res.statusCode = result.statusCode;
        res.send(result);
    });
})
.delete(function(req,res){
    //mongo delete
    let options = baseUserOptions;
    let cardOptions = baseCardOptions;

    if(req.body._id==null){

        cardsDB.deleteAllCards(cardOptions,function(result){
            if(res.statusCode=='400'){
                console.log('nuking the cards didnt work');
            }else{
                console.log('cards nuked successfully');
            }
        });

        usersDB.deleteAllUsers(options,function(result){
            res.statusCode = result.statusCode;
            res.send(result);
        });
    }else{

        cardOptions.user_id = req.body._id;
        cardsDB.deleteCardbyUser(cardOptions,function(result){
            if(res.statusCode=='400'){
                console.log('removed the users cards unsuccesfully');
            }else{
                console.log('removed the users cards succesfully');
            }
        });

        options._id = req.body._id;
        usersDB.deleteUser(options,function(result){
            res.statusCode = result.statusCode;
            res.send(result);
        });
    }
})
.put(function(req,res){
    //mongo edit
    let options = baseUserOptions;
    options.newUserInfo = req.body.newUserInfo;
    options._id = req.body._id;

    usersDB.editUser(options,function(result){
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

    let options = baseUserOptions;
    options.loginInfo = account;

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

    usersDB.insertUser(options,function(result){
        console.log('onResult: ('+ result.statusCode + ')');
        res.statusCode = result.statusCode;
        let response = {};
        if(res.statusCode =='200'){
            console.log('looking for user with params,',q_options);
            usersDB.findUser(q_options,function(user){
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

        let options = baseUserOptions;
        options.userInfo = {
            userName: req.body.userName,
        };

        usersDB.findUser(options,function(result){
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
