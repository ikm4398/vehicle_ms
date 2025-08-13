const VehicleType = require("../models/vehicleTypeModel");

// Get all vehicle types
exports.getVehicleTypes = async (req, res) => {
  try {
    console.log("Fetching all vehicle types...");
    const types = await VehicleType.find().sort({ createdAt: -1 });
    console.log(`Found ${types.length} vehicle types`);
    res.json(types);
  } catch (err) {
    console.error("Error fetching vehicle types:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new vehicle type
exports.createVehicleType = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log("Creating vehicle type:", name);

    const existing = await VehicleType.findOne({ name });
    if (existing) {
      console.log("Vehicle type already exists:", name);
      return res.status(400).json({ error: "Vehicle type already exists" });
    }

    const vehicleType = new VehicleType({ name, description });
    await vehicleType.save();
    console.log("Vehicle type created successfully:", vehicleType);
    res.status(201).json(vehicleType);
  } catch (err) {
    console.error("Error creating vehicle type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update vehicle type
exports.updateVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    console.log(`Updating vehicle type id=${id} with name=${name}`);

    const vehicleType = await VehicleType.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!vehicleType) {
      console.log("Vehicle type not found with id:", id);
      return res.status(404).json({ error: "Vehicle type not found" });
    }

    console.log("Vehicle type updated successfully:", vehicleType);
    res.json(vehicleType);
  } catch (err) {
    console.error("Error updating vehicle type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete vehicle type
exports.deleteVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting vehicle type with id:", id);

    const deleted = await VehicleType.findByIdAndDelete(id);
    if (!deleted) {
      console.log("Vehicle type not found for deletion:", id);
      return res.status(404).json({ error: "Vehicle type not found" });
    }

    console.log("Vehicle type deleted successfully:", deleted);
    res.json({ message: "Vehicle type deleted" });
  } catch (err) {
    console.error("Error deleting vehicle type:", err);
    res.status(500).json({ error: "Server error" });
  }
};
