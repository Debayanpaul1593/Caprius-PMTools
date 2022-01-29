const mongoose = require("mongoose");
require("dotenv").config();

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = mongoose.createConnection(process.env.DB_STRING, dbOptions);

module.exports = connection;
