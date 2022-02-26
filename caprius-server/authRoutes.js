const express = require("express");
const passport = require("passport");
const User = require("./config/schemas").User;
const Task = require("./config/schemas").Task;
const dbo = require("./db");
const { genPassword, issueJWT } = require("./lib/passwordUtils");
const isAuth = require("./routes/authMiddleware").isAuth;
const isAdmin = require("./routes/authMiddleware").isAdmin;
const authRoutes = express.Router();
const validatePassword = require("./lib/passwordUtils").validatePassword;
const moment = require('moment');

function middlewareFunction(req, res, next) {
  console.log("executed search for users");
  //res.status(401).send('Unauthorised!');
  next(req, res, next);
}
//passport.authenticate("local", {
//successRedirect: "/api/login-success",
//failureRedirect: "/api/login-failure",
//})
authRoutes
  .route("/register")
  .get((req, res, next) => {
    res.sendFile(__dirname + "/register.html");
  })
  .post((req, res, next) => {
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
      res.json({
        success: true,
        message: "User has been registered successfully!",
      });
      console.log("Created user", user);
    });
    //res.redirect("/api/login");
  });

authRoutes
  .route("/login")
  .get((req, res, next) => {
    res.sendFile(__dirname + "/login.html");
  })
  .post((req, res) => {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) return res.status(401).send("Did not find user!");
        const isValid = validatePassword(
          req.body.password,
          user.hash,
          user.salt
        );
        if (isValid) {
          const token = issueJWT(user);
          res.status(200).send({ success: true, token: token });
        } else {
          res.status(401).send("Failed to verify user");
        }
      })
      .catch((err) => res.status(401).send(err));
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
authRoutes
  .route("/dashboard")
  .get(passport.authenticate("jwt", { session: false }), (req, res, next) => {
    res.status(200).send("you are now authorised");
  });
authRoutes.route("/admin-dashboard").get(isAuth, isAdmin, (req, res) => {
  res.status(200).send("<h2>Welcome to Admin dashboard</h2>");
});
{
  /*{
    bugId: "3816",
    priority: "1",
    sprint: "Sprint1",
    name: "Create a page for taskslist",
    description: "This and this",
    createdBy: "61e6f1349f9193a7f5c7a28f",
    assignedTo: "Noah",
    finishedBy: "",
    est: "8",
    cost: "",
    left: "",
    deadline: "17-01-2022",
    status: "Waiting",
  }
*/
}
authRoutes
  .route("/tasks")
  .post(async (req, res) => {
    let nextBugId = 0;
    try {
      const lastTask = await Task.findOne().sort({ createdAt: -1 }).limit(1);
      const lastBugId = lastTask.bugId;
      nextBugId = lastBugId + 1;
    } catch {}
    console.log(nextBugId);
    const task = new Task({
      bugId: nextBugId,
      priority: req.body.priority,
      sprint: req.body.sprint,
      name: req.body.name,
      description: req.body.description,
      createdBy: req.body.createdBy,
      assignedTo: req.body.assignedTo,
      finishedBy: req.body.finishedBy,
      est: req.body.est,
      cost: req.body.cost,
      left: req.body.left,
      deadline: moment(req.body.deadline).format('DD-MM-YYYY'),
      status: req.body.status,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    try {
      await task.save();
      return res.status(200).send("Saved task successfully");
    } catch (err) {
      return res.status(500).send(err);
    }
  })
  .get((req, res) => {
    Task.find()
      .then((tasks) => res.status(200).send(tasks))
      .catch((err) => res.status(404).send(err));
  });
module.exports = { authRoutes, middlewareFunction };
