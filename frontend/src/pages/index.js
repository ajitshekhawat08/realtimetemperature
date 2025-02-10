import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function Home() {
  const [temperatures, setTemperatures] = useState([]);

  useEffect(() => {
    socket.on("temperatureUpdate", (temp) => {
      setTemperatures((prevTemps) => [...prevTemps.slice(-9), temp]);
    });

    return () => socket.disconnect();
  }, []);

  const data = {
    labels: temperatures.map((_, i) => `T-${i}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        borderColor: "red",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Real-time Temperature Monitoring</h1>
      <Line data={data} />
    </div>
  );
}
