const mongoose = require("mongoose");
const { Schema } = mongoose;
const connection = require('./database');

const blogSchema = new Schema({
  name: String,
  title: String,
});

const userSchema = new Schema({
  userName: String,
  hash: String,
  salt: String,
});

const Blog = connection.model("blog", blogSchema);
module.exports.Blog = Blog;
