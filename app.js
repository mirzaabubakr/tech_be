const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/auth");
const filesRouter = require("./routes/files");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();
var db = require("./models");
db.sequelize.sync({ force: false });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter);
app.use("/file", filesRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
