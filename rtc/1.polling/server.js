var http = require("http");
var fs = require("fs");

var server = http.createServer(function (req, res) {
  if (req.url == "/time") {
    // 设置 CORS 头部
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin); // 允许来自 http://localhost 的跨域请求
    // 发送时间数据
    res.end(new Date().toLocaleString());
  }
  if (req.url == "/") {
    fs.readFile("./pollingClient.html", "binary", function (err, file) {
      if (!err) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(file, "binary");
        res.end();
      }
    });
  }
});

server.listen(8088, "localhost");
server.on("connection", function (socket) {
  console.log("客户端连接已经建立");
});
server.on("close", function () {
  console.log("服务器被关闭");
});
