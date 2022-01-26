const { MongoClient } = require("mongodb");
const x = require('./constants');
const connectionString = x.API.mongodbUrl;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }
      dbConnection = db.db(x.DB);
      return callback("Successfully connected to MongoDB.");
    });
  },

  getDb: function () {
    return dbConnection;
  },
};