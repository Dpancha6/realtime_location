const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
  console.log("connected ok");
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data }); // broadcast the location to all other clients
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id); // broadcast the user disconnected event to all other clients
    console.log("user disconnected");
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
