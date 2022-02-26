const express = require("express");
const passport = require("passport");
const {User} = require("./config/schemas");
const dbo = require("./db");
const { genPassword, issueJWT } = require("./lib/passwordUtils");
const isAuth = require("./routes/authMiddleware").isAuth;
const isAdmin = require("./routes/authMiddleware").isAdmin;
const authRoutes = express.Router();
const validatePassword = require('./lib/passwordUtils').validatePassword;
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
  const saltHash = genPassword(req.body.password);
  const { salt, hash } = saltHash;
  const user = new User({
    username: req.body.username,
    salt,
    hash,
    role: "admin",
  });
  user.save().then((user) => {
    const jwt = issueJWT(user);
    res.json({success: true, user: user, token: jwt.token, expiresIn: jwt.expires});
    console.log("Created user", user);
  });
  //res.redirect("/api/login");
});

authRoutes.route("/login").post((req, res) => {
  User.findOne({username: req.body.username})
    .then(user => {
      if(!user)
        return res.status(401).send('Did not find user!');
      const isValid = validatePassword(req.body.password, user.hash, user.salt);
      if(isValid){
        const token = issueJWT(user);
        res.status(200).send({success: true, token: token});
      }else{
        res.status(401).send('Failed to verify user');
      }
    })
    .catch(err => res.status(401).send(err));
});

  //passport.authenticate("local", {
    //successRedirect: "/api/login-success",
    //failureRedirect: "/api/login-failure",
  //})
authRoutes.route("/register").get((req, res, next) => {
  res.sendFile(__dirname + "/register.html");
});

authRoutes.route("/login").get((req, res, next) => {
  res.sendFile(__dirname + "/login.html");
});

authRoutes.route("/login-success").get(isAuth, (req, res, next) => {
  res.sendFile(__dirname + "/login-success.html");
});

authRoutes.route("/login-failure").get((req, res, next) => {
  res.sendFile(__dirname + "/login-failure.html");
});

authRoutes.route("/logout").get((req, res) => {
  req.logout();
  res.send("<h2>You have been logged out!</h2>");
});

//authRoutes.route("/dashboard").get(isAuth, (req, res) => {
  //res.status(200).send("<h2>Welcome to dashboard</h2>");
//});
authRoutes.route("/dashboard").get(passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.status(200).send('you are now authorised');
});
authRoutes.route("/admin-dashboard").get(isAuth, isAdmin, (req, res) => {
  res.status(200).send("<h2>Welcome to Admin dashboard</h2>");
});
module.exports = { authRoutes, middlewareFunction };
