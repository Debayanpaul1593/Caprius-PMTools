const express = require("express");
const dbo = require("./db");
const authRoutes = express.Router();
function middlewareFunction(req, res, next) {
  console.log("executed search for users");
  //res.status(401).send('Unauthorised!');
  next(req, res, next);
}
authRoutes.route("/users").get(async function (req, res, next) {
  dbo
    .getDb()
    .collection("CAPRIUS_AUTH_COLL")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
      } else {
        res.status(200).json(result);
      }
    });
});

authRoutes.route("/register").post((req, res, next) => {
  console.log("Caught req", req);
});

authRoutes.route("/login").post((req, res, next) => {
  console.log("Caught req", req);
});

authRoutes.route("/register").get((req, res, next) => {
  res.sendFile(__dirname + "/register.html");
});

authRoutes.route("/login").get((req, res, next) => {
  res.sendFile(__dirname + "/login.html");
});
module.exports = { authRoutes, middlewareFunction };
