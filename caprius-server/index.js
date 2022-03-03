const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const dbo = require("./db");
const {authRoutes, middlewareFunction} = require("./authRoutes");
const Blog = require("./config/schemas");
const passport = require("passport");
const MongoStore = require("connect-mongo");

/**
 * -------------APPLICATION CONFIGURATION--------
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

//connect to db using mongoose
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * --------------CREATE MONGOOSE SESSION--------
 */
const sessionStore = MongoStore.create({
  // eslint-disable-next-line no-undef
  mongoUrl: process.env.DB_STRING,
  mongoOptions: dbOptions,
  collectionName: "sessions",
});

/**
 * --------------CONFIGURE SESSION STORE--------
 */
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 60 * 1000 },
  })
);

/**
 * --------------CONFIGURE PASSPORT--------
 */
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});


let f = undefined;
app.use("/api", authRoutes);
app.get("/", (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }
  res.send(`You have visited this page ${req.session.viewCount} times`);
});

app.post("/", (req, res) => {
  Blog.create({ name: "Debayan", title: "Paul" }, (err, blog) => {
    if (err || !blog) {
      console.log("Unable to create blog");
      res.status(400).send("Unable to create blog");
    } else {
      console.log("Created blog");
      res.status(200).send("Created blog");
    }
  });
});

/**
 * -----------------START SERVER----------------
 */
app.listen(5000, () => {
  console.log("Example app listening on port 3000");
});
