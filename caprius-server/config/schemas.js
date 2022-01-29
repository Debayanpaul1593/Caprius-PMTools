const mongoose = require("mongoose");
const { Schema } = mongoose;
const connection = require("./database");

const blogSchema = new Schema({
  name: String,
  title: String,
});

const userSchema = new Schema({
  username: String,
  hash: String,
  salt: String,
});

const Blog = connection.model("blog", blogSchema);
const User = connection.model("user", userSchema);
module.exports.Blog = Blog;
module.exports.User = User;
