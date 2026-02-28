const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Allow CORS for deployment
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MUST use process.env.PORT in production
const PORT = process.env.PORT || 3000;

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("codeChange", (code) => {
    socket.broadcast.emit("codeChange", code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});