const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const dbo = require("./db");
const { authRoutes, middlewareFunction } = require("./authRoutes");
const Blog = require("./config/schemas");

//create mongostore for session
const MongoStore = require("connect-mongo");

//create the express application
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
require("dotenv").config();

//connect to db using mongoose
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connection = mongoose.createConnection(process.env.DB_STRING, dbOptions);
//mongoose.connect(dbstring, (_) => console.log("connected to mongodb"));
// dbo.connectToServer((res) => {
//   console.log(">>", res);
// });

//create session store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING,
  //db: connection.db,
  mongoOptions: dbOptions,
  collectionName: "sessions",
});

//use session store with app
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 60 * 1000 },
  })
);

app.use("/api", middlewareFunction, authRoutes);
app.get("/", (req, res) => {
  //console.log(req.session);
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }
  //res.send("<h1>Hello World!(Sessions)</h1>");
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

app.listen(port, () => {
  console.log("Example app listening on port 3000");
});
