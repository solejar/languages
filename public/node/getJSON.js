var http = require('http')
var https = require('https')

exports.getJSON = function(options, onResult){
    console.log("rest::getJSON"+JSON.stringify(options));

    var port = options.port == 443? https: http;
    var req = port.request(options,function(res){
        var output = '';
        res.setEncoding('utf8');

        res.on('data',function(chunk){
            output+=chunk;
        });

        res.on('end',function(){
            var obj = JSON.parse(output);
            onResult(res.statusCode,obj);
        });

    });

    req.on('error',function(err){
        res.send('error: ' + err.message)
    });

    req.end();
};