const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let onlineUsers = 0;

io.on("connection", (socket) => {
    onlineUsers++;
    io.emit("online-users", onlineUsers);

    socket.on("code-change", (data) => {
        socket.broadcast.emit("code-update", data);
    });

    socket.on("disconnect", () => {
        onlineUsers--;
        io.emit("online-users", onlineUsers);
    });
});

server.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});