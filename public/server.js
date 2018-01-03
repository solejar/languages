const express = require('express')
const app = express()

const port = 8080
var rest = require('./node/getJSON.js') //this is a manual rest implementation because i am a sorry man who does not understand express
var mongo = require('./node/mongo.js')

app.set('port', (process.env.PORT || 5000)); //set port to what is set or 5000 as default
app.use(express.static(__dirname + '/')) //this line let's me include files as if my index html was at the /public/ level

app.set('views',__dirname + '/views/'); //sets default render dir
app.engine('html',require('ejs').renderFile);
app.set('view engine','html'); //i just added these two lines cause I saw them in a tutorial

app.get('/',function(req,res){
    res.render('index.html');
});

app.get('/ru/prepositions',function(req,res){
    var options = {
        lang: 'ru'
    }
    mongo.getPrepositions(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

//not that it really matters but eventually this should be generalized to a regex
app.get('/ru/labels',function(req,res){
    var options = {
        lang: 'ru'
    }
    mongo.getLabels(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
});

app.get('/ru/declensionRules',function(req,res){
    var options = {
        lang: 'ru'
    }
    mongo.getDeclensionRules(options,function(result){
        console.log('onResult: (' + result.statusCode + ')');
        res.statusCode = result.statusCode;
        res.send(result);
    });
})

app.listen(port,(err)=>{
    if(err){
        return console.log('something bad happened',err)
    }

    console.log('server is listening on 8080, howdy')
})
