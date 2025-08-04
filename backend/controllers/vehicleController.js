const Vehicle = require("../models/vehicleModel");

async function createVehicle(req, res) {
  try {
    const {
      unit_id,
      vehicle_registration_number,
      vehicle_type,
      working_site,
      arrival_date,
      insurance_details,
      tax_details,
      status,
    } = req.body;

    console.log("Received request to create vehicle:", req.body);

    const existing = await Vehicle.findOne({ vehicle_registration_number });
    if (existing) {
      console.warn(`Vehicle already exists: ${vehicle_registration_number}`);
      return res.status(400).json({ message: "Vehicle already exists." });
    }

    const vehicle = new Vehicle({
      unit_id,
      vehicle_registration_number,
      vehicle_type,
      working_site,
      arrival_date,
      insurance_details,
      tax_details,
      status,
    });

    await vehicle.save();

    console.log(`Vehicle created successfully: ${vehicle_registration_number}`);

    res.status(201).json({ message: "Vehicle saved successfully." });
  } catch (error) {
    console.error("Error creating vehicle:", error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getVehicle(req, res) {
  try {
    console.log("Fetching all vehicles...");
    const vehicles = await Vehicle.find();
    console.log(`Fetched ${vehicles.length} vehicles.`);
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error.message);
    res.status(500).json({ message: error.message });
  }
}

async function updateVehicle(req, res) {
  try {
    const vehicleId = req.params.id;
    const updates = req.body;

    console.log(`Updating vehicle ID: ${vehicleId}`, updates);

    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      console.warn(`Vehicle not found: ${vehicleId}`);
      return res.status(404).json({ message: "Vehicle not found." });
    }

    console.log(`Vehicle updated: ${vehicleId}`);
    res.status(200).json({
      message: "Vehicle updated successfully.",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createVehicle, getVehicle, updateVehicle };
