const express = require('express');
const bodyParser = require('body-parser');

const passport = require('passport');

const app = express();

const declension = require('./node/routes/declension');
const users = require('./node/routes/users');
const general = require('./node/routes/general');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = 8020;

app.set('port', (process.env.PORT || 5000)); //set port to what is set or 5000 as default
app.use(express.static(__dirname + '/')); //this line let's me include files as if my index html was at the /public/ level

app.use('/declension',declension);
app.use('/users',users);
app.use('/',general);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Oirigin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type, Authorization');
    next();
});

app.set('views',__dirname + '/views/'); //sets default render dir
app.engine('html',require('ejs').renderFile);
app.set('view engine','html'); //i just added these two lines cause I saw them in a tutorial

app.listen(port,(err)=>{
    if(err){
        return console.log('something bad happened',err);
    }

    console.log('server is listening on 8080, howdy');
});

module.exports = app;
