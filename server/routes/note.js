var express = require("express");
const ejs = require("ejs");
const marked = require("marked");
const fs = require("fs");
const path = require("path");
const browserSync = require("browser-sync");
const hljs = require("highlight"); // 引入highlight.js
var router = express.Router();

const notesPath = path.join("F:\\", "notes");
const markdownFiles = fs.readdirSync(notesPath);
marked.setOptions({
  highlight: function (code, lang) {
    // 使用highlight.js进行代码高亮
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(validLang, code).value;
  },
});
const openBrowser = (filePath) => {
  const browser = browserSync.create();
  browser.init({
    server: {
      baseDir: `${path.resolve(__dirname, "../public/html")}`,
      index: `${filePath}.html`,
    },
  });
  return browser;
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("noteRouter");
  // console.log(markdownFiles);
  res.render("md", { mdFileList: markdownFiles });
});

// 渲染 Markdown 文件为 HTML
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filenameExcludemd = filename.slice(0, -3);
  const markdownPath = path.join("F:\\", "notes", `${filename}`);
  // 检查文件是否存在
  if (fs.existsSync(markdownPath)) {
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");
    // res.render("mdContext", { content: markdownContent });

    ejs.renderFile(
      path.resolve(__dirname, "../views/mdContext.ejs"),
      {
        content: marked.parse(markdownContent.toString()),
        title: "markdown to html",
      },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        let writeStream = fs.createWriteStream(
          path.resolve(__dirname, `../public/html/${filenameExcludemd}.html`)
        );
        writeStream.write(data);
        writeStream.close();
        res.sendFile(path.resolve(__dirname, `../public/html/${filenameExcludemd}.html`)); // 直接返回已生成的 HTML 文件
        // writeStream.on("finish", () => {
        //   openBrowser(filenameExcludemd);
        // });
      }
    );
  } else {
    res.status(404).send("Not Found");
  }
});

// 动态加载所有 Markdown 文件并创建对应路由
markdownFiles.forEach((filename) => {
  if (filename.endsWith(".md")) {
    const routePath = `/notes/${path.parse(filename).name}`;
    router.get(routePath, (req, res) => {
      res.redirect(`/notes/${path.parse(filename).name}`);
    });
  }
});

module.exports = router;
