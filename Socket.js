const socket_io = require("socket.io");
var io = socket_io();
const User = require("./DB.js");

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
