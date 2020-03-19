const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const cors = require("cors");
const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.set("origins", "*:*");

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      return callback(error);
    }

    const users_in_room = getUsersInRoom(getUser(socket.id).room);

    const names_users_in_room = [];
    users_in_room.forEach(obj => {
      names_users_in_room.push(obj.name);
    });

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`
    });

    //These two are to notify the user and its room members about the number of users
    socket.emit("getUsers", {
      UserNames: names_users_in_room
    });
    io.to(user.room).emit("getUsers", {
      UserNames: names_users_in_room
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name}, has joined the chat`
    });
    socket.join(user.room);

    //Callback for the frontend .. without any errors
    callback();
  });

  //The user generated ones are "sendMessage" and the admin generated ones are "message"
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const curr_user = getUser(socket.id);
    if (curr_user) {
      const room_now = curr_user.room;

      const user = removeUser(socket.id);
      const users_in_room = getUsersInRoom(room_now);
      if (user) {
        io.to(user.room).emit("message", {
          user: "admin",
          text: `user ${user.name} has left`
        });
      }

      const names_users_in_room = [];
      users_in_room.forEach(obj => {
        names_users_in_room.push(obj.name);
      });

      io.to(user.room).emit("getUsers", {
        UserNames: names_users_in_room
      });
    }
  });
});

app.use(router);
app.use(cors());
server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
