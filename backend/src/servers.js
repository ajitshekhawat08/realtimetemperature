const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const TemperatureSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now },
});
const Temperature = mongoose.model("Temperature", TemperatureSchema);

app.use(cors());
app.use(express.json());

app.post("/store-temperature", async (req, res) => {
  try {
    const temp = new Temperature({ value: req.body.value });
    await temp.save();
    io.emit("temperatureUpdate", req.body.value);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(5000, () => console.log("Server running on port 5000"));
