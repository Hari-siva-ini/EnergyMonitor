import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const PowerMonitoring = () => {
  const [loadsHistory, setLoadsHistory] = useState({}); // { ESP32_1: { load1: [...], load2: [...] }, ... }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/readings"); 
        const newData = response.data;

        setLoadsHistory((prev) => {
          const updated = { ...prev };

          newData.forEach((device) => {
            if (!updated[device.deviceId]) updated[device.deviceId] = {};

            device.loads.forEach((load) => {
              const prevLoadData = updated[device.deviceId][load.loadId] || [];
              const newLoadData = [
                ...prevLoadData,
                {
                  timestamp: new Date().toLocaleTimeString(),
                  voltage: load.voltage,
                  current: load.current,
                  power: load.power,
                  energy_wh: load.energy_wh,
                },
              ];
              updated[device.deviceId] = {
                ...updated[device.deviceId],
                [load.loadId]: newLoadData.slice(-20),
              };
            });
          });

          return updated;
        });
      } catch (error) {
        console.error("Error fetching readings:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);
const loadNames = {
  1: 'Fan',
  2: 'LED',
  3: 'Mobile Charger',
  4: 'Laptop Charger'
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Power Monitoring</h2>

      {Object.entries(loadsHistory).map(([deviceId, loads]) => (
        <div key={deviceId} className="mb-10 bg-white shadow rounded-lg p-4">
          <h3 className="text-2xl font-semibold mb-4">{deviceId}</h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(loads).map(([loadId, data]) => (
              <div key={loadId} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                <h2 className="mb-4">{loadNames[loadId]}</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={data}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                    <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="voltage" stroke="#1cff7eff" strokeWidth={2}  />
                    <Line type="monotone" dataKey="current" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="power" stroke="#ff28c2ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="energy_wh" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PowerMonitoring;
