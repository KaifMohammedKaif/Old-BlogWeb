const mongoose = require("mongoose");

const pageSchema = {
  pageName: {
    type: String,
    required: true,
  },
  pageContent: {
    type: String,
  },
};

const pages = mongoose.model("page", pageSchema);

module.exports = pages;
