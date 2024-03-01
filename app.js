const express = require("express");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Posts = require("./models/posts.js");
const pages = require("./models/pages.js");
const bodyParser = require("body-parser");
const pagesData = require("./models/data.js");
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/BlogWorld");
}
if (pagesData === "") {
  pages.insertMany(pagesData);
}

app.get("/", async function (req, res) {
  let page = await pages.findOne({ pageName: "Home" });
  let posts = await Posts.find();
  res.render("./posts/home", { page, posts });
});

app.get("/about", async function (req, res) {
  let page = await pages.findOne({ pageName: "About" });
  res.render("./posts/about", { page });
});

app.get("/contact", async function (req, res) {
  let page = await pages.findOne({ pageName: "Contact" });
  res.render("./posts/contact", { page });
});

app.get("/compose", function (req, res) {
  res.render("./posts/compose");
});

app.get("/posts/:topic/edit", async (req, res) => {
  let { topic } = req.params;
  let post = await Posts.findOne({ title: topic });
  res.render("./posts/edit", { post });
});

app.get("/posts/:topic", async function (req, res) {
  const storedTitle = req.params.topic;
  let posts = await Posts.find({ title: storedTitle });
  posts.forEach((post) => {
    const requestTitle = post.title;
    if (storedTitle == requestTitle) {
      res.render("./posts/post", {
        title: post.title,
        content: post.content,
      });
    }
  });
});

app.post("/compose", async function (req, res) {
  const post = new Posts({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  await post.save();
  res.redirect("/");
});

app.put("/posts/:topic", async (req, res) => {
  let { topic } = req.params;
  await Posts.findOneAndUpdate(
    { title: topic },
    { title: req.body.postTitle, content: req.body.postBody }
  );
  res.redirect("/posts/" + topic + "/");
});

app.delete("/posts/:topic", async (req, res) => {
  let { topic } = req.params;
  await Posts.findOneAndDelete({ title: topic });
  res.redirect("/");
});

app.post("/post/search", (req, res) => {
  let { search } = req.body;
  res.redirect("/posts/" + search + "/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
