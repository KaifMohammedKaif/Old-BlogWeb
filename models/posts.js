const mongoose = require("mongoose");

const postSchema = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
};

const Posts = mongoose.model("post", postSchema);

module.exports = Posts;
