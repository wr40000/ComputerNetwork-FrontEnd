var http=require('http');
var fs = require("fs");
var count=0;
var server=http.createServer(function(req,res){
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    if(req.url=='/evt'){
        //res.setHeader('content-type', 'multipart/octet-stream');
        res.writeHead(200, {"Content-Type":"tex" +
            "t/event-stream", "Cache-Control":"no-cache",
            'Access-Control-Allow-Origin': '*',
            "Connection":"keep-alive"});
        var timer=setInterval(function(){
            if(++count==10){
                clearInterval(timer);
                res.end();
            }else{
                // res.write('id: ' + count + '\n');
                res.write('event:lol' + '\n'); 
                res.write("data: " + new Date().toLocaleString() + '\n\n');
            }
        },500);
 
    };
    if(req.url=='/'){
        fs.readFile("./sse.html", "binary", function(err, file) {
            if (!err) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(file, "binary");
                res.end();
            }
        });
    }
}).listen(8088,'localhost');