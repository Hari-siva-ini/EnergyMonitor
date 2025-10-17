const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/energyDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Load and PowerData schemas
const LoadSchema = new mongoose.Schema({
  loadId: { type: Number, required: true },
  name: { type: String, default: "Unknown" }, // Add name field for bill
  voltage: { type: Number, default: 0 },
  current: { type: Number, default: 0 },
  power: { type: Number, default: 0 },
  energy_wh: { type: Number, default: 0 },
});

const PowerDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  loads: [LoadSchema],
  timestamp: { type: Date, default: Date.now },
});

const PowerData = mongoose.model("PowerData", PowerDataSchema);

// ✅ Define EnergyModel for ElectricBill API
const EnergySchema = new mongoose.Schema({
  loadId: { type: Number, required: true },
  name: { type: String, required: true },
  energy: { type: Number, required: true }, // in Wh
  timestamp: { type: Date, default: Date.now }
});

const EnergyModel = mongoose.model("Energy", EnergySchema);

// ✅ POST API - ESP32 sends data here
app.post("/api/readings", async (req, res) => {
  try {
    const reading = new PowerData(req.body);
    await reading.save();
    res.status(200).json({ message: "Saved", data: reading });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET API - fetch latest readings per device
app.get("/api/readings", async (req, res) => {
  try {
    const devices = await PowerData.aggregate([
      { $sort: { timestamp: -1 } },        
      { $group: {
          _id: "$deviceId",                
          deviceId: { $first: "$deviceId" },
          loads: { $first: "$loads" },
          timestamp: { $first: "$timestamp" }
      }}
    ]);
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// server.js
// ✅ GET API - fetch energy consumption flattened
app.get("/api/energy-consumption", async (req, res) => {
  try {
    const devices = await PowerData.find({}); // all devices
    const loads = devices.flatMap(device =>
      device.loads.map(load => ({
        deviceId: device.deviceId,
        loadId: load.loadId,
        voltage: load.voltage,
        current: load.current,
        power: load.power,
        energy_wh: load.energy_wh,
      }))
    );

    res.json({ loads }); // ✅ always return loads as array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ GET API by deviceId
app.get("/api/readings/:deviceId", async (req, res) => {
  try {
    const readings = await PowerData.find({ deviceId: req.params.deviceId }).sort({ timestamp: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
