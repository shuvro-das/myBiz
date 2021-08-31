const { Router } = require("express");
const express = require("express");
const User = require("./DB.js");

const socket_io = require("socket.io");
var io = socket_io();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("server ok");
});

app.post("/input", async (req, res) => {
  const dataUser = new User({
    name: req.body.name,
    age: req.body.age,
  });
  const newData = await dataUser.save();

  res.send(newData);
});

urlasd =
  "mongodb+srv://admin1:XxvqZUvGf8LKYJCR@cluster0.vfqse.mongodb.net/TestData?retryWrites=true&w=majority";
mongoose.connect(urlasd, () => {
  console.log("DB connected");
});

const changeStream = User.watch();

changeStream.on("change", (change) => {
  console.log(change);
  io.emit("changeData", change);
});

io.on("connection", function () {
  console.log("connected");
});

var socket = io;
module.exports = socket;

port = 5000;
app.listen(port, () => {
  console.log("Server started.");
});
