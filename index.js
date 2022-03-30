// const { transaction } = require("./models");
const express = require("express");
require("dotenv").config();

const cors = require("cors");

// import package
const http = require("http");
const { Server } = require("socket.io");

const router = require("./src/routes/index");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// add after app initialization
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // define client origin if both client and server have different origin
  },
});

require("./src/socket")(io);

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
