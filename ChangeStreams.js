const { MongoClient } = require("mongodb");
const socket_io = require("socket.io");
var io = socket_io();

async function main() {
  const uri =
    "mongodb+srv://admin1:XxvqZUvGf8LKYJCR@cluster0.vfqse.mongodb.net/TestData?retryWrites=true&w=majorit";

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const pipeline = [
      {
        $match: {
          operationType: "insert",
          "fullDocument.address.country": "Australia",
          "fullDocument.address.market": "Sydney",
        },
      },
    ];
    await monitorListingsUsingEventEmitter(client, 20000, pipeline);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function monitorListingsUsingEventEmitter(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = client.db("TestData").collection("userTestData");

  const changeStream = collection.watch(pipeline);

  changeStream.on("change", (next) => {
    console.log(next);
    io.emit("changedata", next);
  });
  io.on("connection", function () {
    console.log("connected");
  });

  // Wait the given amount of time and then close the change stream
  await closeChangeStream(timeInMs, changeStream);
}

function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing the change stream");
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}

// const socket_io = require("socket.io");
// var io = socket_io();
// const User = require("./DB.js");

// const changeStream = User.watch();

// changeStream.on("change", (change) => {
//   console.log(change);
//   io.emit("changeData", change);
// });

// io.on("connection", function () {
//   console.log("connected");
// });

// var socket = io;
// module.exports = socket;
