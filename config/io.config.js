const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});

module.exports = io;
