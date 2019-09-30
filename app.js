const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("listening 0n 3000...");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//all emits go in heeree
io.sockets.on("connection", function(socket) {
  connections.push(socket);
  console.log("connected: %s connected", connections.length);

  //disconnect
  socket.on("disconnect", function(data) {
    users.splice(users.indexOf(socket.username), 1)
    updateUsernames()
    connections.splice(connections.indexOf(socket), 1);
    console.log("disconnected: %s disconnected", connections.length);
  });
  // send msg
  socket.on("send message", function(data) {
    io.sockets.emit("new message", { msg: data, user: socket.username });
  });
  //new user
  socket.on("new user", function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });
  function updateUsernames() {
    io.sockets.emit("get users", users);
  }
});
