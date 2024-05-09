var express = require("express");
var router = express.Router();
// https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
const multer = require("multer"); // 需要安装 multer 中间件
const path = require("node:path");
const fs = require("node:fs/promises");

// 设置存储引擎和路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/public/images/"); // 设置上传文件的存储路径
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 保留上传文件的原始文件名
  },
});
const upload = multer({ storage: storage });

router.get("/ajax", function (req, res, next) {
  const query = req.url.split("=")[1];
  const searchResults = generateSearchResults(query);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Set-Cookie": "sessionId=/ajax; HttpOnly; Path=/",
  });
  res.end(JSON.stringify(searchResults));
});

router.get("/xhr_get", function (req, res, next) {
  try {
    const cookie = req.headers.cookie.split("=")[1];
    console.log("有人访问xhr_get, req.body: ", req.body, "cookie: ", cookie);
  } catch (error) {
    console.log(error);
  }
  console.log("有人访问xhr_get", req.query);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Set-Cookie": "sessionId=/xhr_get; HttpOnly; Path=/; SameSite=None; Secure",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5502",
    "Access-Control-Allow-Credentials": "true",
  });

  res.end(
    JSON.stringify({
      code: 200,
      route: req.path,
    })
  );
});

router.post("/xhr_post", function (req, res, next) {
  try {
    const cookie = req.headers.cookie.split("=")[1];
    console.log("有人访问xhr_post, req.body: ", req.body, "cookie: ", cookie);
  } catch (error) {
    console.log(error);
  }
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "http://127.0.0.1:5502",
    "Access-Control-Allow-Credentials": "true",
  });
  res.end(
    JSON.stringify({
      code: 200,
      route: req.path,
    })
  );
});

router.post("/xhr_post_content_type", function (req, res, next) {
  // console.log("有人访问xhr_post, req.body: ", req.body);
  res.json({
    code: 200,
    route: req.path,
  });
});

router.post("/file", upload.single("file"), function (req, res, next) {
  console.log("有人访问 /file, 上传文件中..., req.file: ", req.file);
  res.json({
    code: 200,
    route: req.path,
  });
});

router.get("/fetch_post", async function (req, res, next) {
  // console.log("有人访问xhr_post, req.body: ", req.body);
  // const filePath = path.resolve(__dirname, "../../uploads/data.json");
  const filePath = path.resolve(__dirname, "../../uploads/worklog.txt");
  const jsonData = await fs.readFile(filePath, "utf-8");
  // const jsonData = JSON.parse(jsonData);

  // 使用 res.json() 发送 JSON 数据
  res.json(jsonData);
});

router.get("/sse", async function (req, res, next) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream", //核心返回数据流
    Connection: "close",
  });
  const filePath = path.resolve(__dirname, "../../uploads/newyear.txt");
  const data = await fs.readFile(filePath, "utf-8");
  const total = data.length;
  let current = 0;
  //mock sse 数据
  let time = setInterval(() => {
    console.log(current, total);
    if (current >= total) {
      console.log("end");
      clearInterval(time);
      return;
    }
    const currentChar = data.charAt(current);
    const eventData = currentChar === "\n" ? "\\n" : currentChar; // 将换行符转义为 \n
    //返回自定义事件名
    res.write(`event:lol\n`); // 返回数据;
    // 每条消息应该以两个换行符 (\n\n) 结尾，表示该消息结束。
    res.write(`data:${eventData}\n\n`);
    current++;
  }, 50);
});

function generateSearchResults(query) {
  const results = [];
  for (let i = 0; i < 5; i++) {
    results.push(`Result ${query}-${i}`);
  }
  return results;
}

module.exports = router;
