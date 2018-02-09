const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const translate = require('google-translate-api')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const routes = require('./node/routes/index');
//const users = require('./node/routes/users');

const app = express()
const port = 8080

app.set('port', (process.env.PORT || 5000)); //set port to what is set or 5000 as default
app.use(express.static(__dirname + '/')) //this line let's me include files as if my index html was at the /public/ level
app.use(flash());

//app.use(logger('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/',routes)

app.use(bodyParser.json());

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./node/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//mongoose
mongoose.connect('mongodb://localhost/passport_local_mongo')

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Oirigin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, POST');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
    next();
})

app.set('views',__dirname + '/views/'); //sets default render dir
app.engine('html',require('ejs').renderFile);
app.set('view engine','html'); //i just added these two lines cause I saw them in a tutorial

app.listen(port,(err)=>{
    if(err){
        return console.log('something bad happened',err)
    }

    console.log('server is listening on 8080, howdy')
})

module.exports = app;
