const { ObjectId } = require("mongodb");
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
  createdAt: {
    type: Date,
    immutable: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  role: String,
});

const taskSchema = new Schema({
  bugId: {
    type: Number,
    default: 0,
  },
  priority: String,
  sprint: String,
  name: String,
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  finishedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  est: String,
  cost: String,
  left: String,
  deadline: String,
  status: {
    type: String,
    default: "Waiting",
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});
const Blog = connection.model("blog", blogSchema);
const User = connection.model("user", userSchema);
const Task = connection.model("task", taskSchema);
//module.exports.Blog = Blog;
module.exports.User = User;
module.exports.Task = Task;
