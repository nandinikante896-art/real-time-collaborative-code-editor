
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the existing index.html from the repository root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static assets if a public folder exists
app.use(express.static(path.join(__dirname, "public")));

let onlineUsers = 0;

io.on("connection", (socket) => {
    onlineUsers++;
    io.emit("online-users", onlineUsers);

    socket.on("code-change", (data) => {
        socket.broadcast.emit("code-update", data);
    });

    socket.on("disconnect", () => {
        onlineUsers = Math.max(0, onlineUsers - 1);
        io.emit("online-users", onlineUsers);
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
