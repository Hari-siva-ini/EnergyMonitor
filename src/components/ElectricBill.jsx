import React, { useState, useEffect } from "react";
import axios from "axios";

const ElectricBill = () => {
  const [energyData, setEnergyData] = useState([]);
  const [ratePerKWh, setRatePerKWh] = useState(5.5);
  const [loading, setLoading] = useState(true);

  // ✅ Load names mapping
  const loadNames = {
    1: "Fan",
    2: "LED",
    3: "Mobile Charger",
    4: "Laptop Charger",
  };

  useEffect(() => {
    fetchEnergyData();
    const interval = setInterval(fetchEnergyData, 5000);
    return () => clearInterval(interval);
  }, []);

 const fetchEnergyData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/energy-consumption");
    console.log("Raw Response Data:", response.data);

    const loads = response.data.loads || [];

    // Group by loadId
    const groupedLoads = loads.reduce((acc, load) => {
      if (!acc[load.loadId]) acc[load.loadId] = { ...load, energy_wh: 0 };
      acc[load.loadId].energy_wh += load.energy_wh || 0;
      return acc;
    }, {});

    const groupedArray = Object.values(groupedLoads);
    console.log("Grouped Loads:", groupedArray);

    // Update state with grouped data
    setEnergyData(groupedArray);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching energy data:", error);
    setEnergyData([]);
    setLoading(false);
  }
};



  const calculateBill = (energyWh) => (energyWh / 1000) * ratePerKWh;

  const totalEnergy = Array.isArray(energyData)
    ? energyData.reduce((sum, load) => sum + (load.energy_wh || 0), 0)
    : 0;

  const totalBill = calculateBill(totalEnergy);

  // ✅ CSV Download
  const downloadCSV = () => {
    const headers = [
      "Device ID",
      "Load ID",
      "Load Name",
      "Voltage (V)",
      "Current (A)",
      "Power (W)",
      "Energy (Wh)",
      "Bill (₹)",
    ];

    const rows = energyData.map((load) => [
      load.deviceId,
      load.loadId,
      loadNames[load.loadId] || `Load ${load.loadId}`,
      load.voltage?.toFixed(2),
      load.current?.toFixed(3),
      load.power?.toFixed(2),
      load.energy_wh?.toFixed(5),
      calculateBill(load.energy_wh).toFixed(2),
    ]);

    rows.push([
      "TOTAL",
      "-",
      "-",
      "-",
      "-",
      "-",
      totalEnergy.toFixed(5),
      totalBill.toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `electric_bill_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) return <div>Loading bill data...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Electric Bill (Grouped by Load)</h2>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2">Rate (₹/kWh):</label>
          <input
            type="number"
            value={ratePerKWh}
            onChange={(e) => setRatePerKWh(parseFloat(e.target.value) || 0)}
            className="border px-2 py-1 rounded"
            step="0.1"
          />
        </div>
        <button
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇ Download CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Energy Consumed</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(totalEnergy / 1000).toFixed(3)} kWh
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Bill</h3>
          <p className="text-3xl font-bold text-green-600">₹{totalBill.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Device ID</th>
            <th className="px-4 py-2 border">Load ID</th>
            <th className="px-4 py-2 border">Load Name</th>
            <th className="px-4 py-2 border">Voltage (V)</th>
            <th className="px-4 py-2 border">Current (A)</th>
            <th className="px-4 py-2 border">Power (W)</th>
            <th className="px-4 py-2 border">Energy (Wh)</th>
            <th className="px-4 py-2 border">Bill (₹)</th>
          </tr>
        </thead>
        <tbody>
          {energyData.map((load, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{load.deviceId}</td>
              <td className="px-4 py-2 border">{load.loadId}</td>
              <td className="px-4 py-2 border">
                {loadNames[load.loadId] || `Load ${load.loadId}`}
              </td>
              <td className="px-4 py-2 border">{load.voltage?.toFixed(2)}</td>
              <td className="px-4 py-2 border">{load.current?.toFixed(3)}</td>
              <td className="px-4 py-2 border">{load.power?.toFixed(2)}</td>
              <td className="px-4 py-2 border">{load.energy_wh?.toFixed(5)}</td>
              <td className="px-4 py-2 border">
                ₹{calculateBill(load.energy_wh).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-bold">
            <td className="px-4 py-2 border" colSpan="6">TOTAL</td>
            <td className="px-4 py-2 border">{totalEnergy.toFixed(5)}</td>
            <td className="px-4 py-2 border">₹{totalBill.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ElectricBill;
