const mongoose = require("mongoose");
const { Schema } = mongoose;
const dbstring = "mongodb://localhost:27017/CAPRIUS_DB";
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = mongoose.createConnection(dbstring, dbOptions);
const blogSchema = new Schema({
  name: String,
  title: String,
});

const userSchema = new Schema({
  email: String,
  password: String,
  role: String,
  status: String,
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
module.exports = Blog;
