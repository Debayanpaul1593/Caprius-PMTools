const express = require("express");
const cors = require("cors");
const dbo = require("./db");
const { authRoutes, middlewareFunction } = require("./authRoutes");
const app = express();

app.use(cors());
const port = 3000;
dbo.connectToServer((res) => {
  console.log(">>", res);
});
app.use("/api", middlewareFunction, authRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Example app listening on port 3000");
});
