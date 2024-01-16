var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var expressWs = require("express-ws");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var xhrRouter = require("./routes/xhr");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const wss = expressWs(app);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/net", xhrRouter);

const state = {
  HEART: 1,  // 代表是心跳包
  MESSAGE: 2, // 代表是数据
};
// WebSocket 路由
app.ws("/websocket", (ws, req) => {
  console.log("WebSocket 连接建立");

  ws.on("connection", (socket) => {
    console.log("连接成功...");
  });

  ws.on("message", (message) => {
    console.log(`收到消息: ${message}`);
    // 处理收到的消息，可以向客户端发送消息等
    // 广播  set结构 所有用户：wss.getWss().clients
    wss.getWss().clients.forEach((client) => {
      client.send(JSON.stringify({state:state.MESSAGE,
        message:"我是nodejs服务器，我收到你的消息了" + message}))
    });
  });

  let heartInreval = null;
  //心跳包
  const sendHeart = () => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ state: state.HEART, 
        message: "<-- 服务端稳定 -->" }));
    } else {
      clearInterval(heartInreval);
    }
  };
  heartInreval = setInterval(sendHeart, 2000);

  ws.on("close", () => {
    console.log("WebSocket 连接关闭");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen("3030", () => {
  console.log("3030端口监听中......");
});

module.exports = app;
