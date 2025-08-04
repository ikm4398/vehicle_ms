const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fetchUnits = require("./modules/units");
const fetchSensorValues = require("./modules/sensors");
const connectDB = require("./config/connectDB");
const path = require("path");
const vehicleRoutes = require("./routes/vehicleRoute");

dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();

const app = express();

app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

//dd
// Routes
app.use("/api/vehicles", vehicleRoutes);

app.get("/units", async (req, res) => {
  try {
    const units = await fetchUnits();
    res.json(units);
  } catch (error) {
    console.error("Error fetching units:", error.message);
    res.status(500).json({ error: "Failed to fetch units" });
  }
});

// Get last message sensor values for a unit
app.get("/unit/:id/sensors", async (req, res) => {
  const unitId = parseInt(req.params.id);
  const sensorIds = req.query.sensors
    ? req.query.sensors.split(",").map(Number)
    : [];

  try {
    const sensorValues = await fetchSensorValues(unitId, sensorIds);
    res.json(sensorValues);
  } catch (error) {
    console.error("Error fetching sensor values:", error.message);
    res.status(500).json({ error: "Failed to fetch sensor values" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
