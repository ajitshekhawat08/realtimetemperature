const io = require("socket.io-client");
const axios = require("axios");
require("dotenv").config();

const socket = io(process.env.BACKEND_URL || "http://localhost:5000");

function generateTemperature() {
  return (Math.random() * 10 + 20).toFixed(2);
}

setInterval(async () => {
  const temperature = generateTemperature();
  console.log(`Sending temperature: ${temperature}°C`);
  socket.emit("temperatureUpdate", temperature);
  await axios.post(`${process.env.BACKEND_URL}/store-temperature`, { value: temperature })
    .catch((error) => console.error("Error storing temperature:", error.message));
}, 5000);
