const Driver = require("../models/driverModel");

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

exports.createDriver = async (req, res) => {
  try {
    const driverData = {
      name: req.body.name,
      joiningDate: req.body.joiningDate,
      mobile: req.body.mobile,
      address: req.body.address,
      licenseAttachment: req.files?.licenseAttachment?.[0]?.path || "",
      citizenshipFront: req.files?.citizenshipFront?.[0]?.path || "",
      citizenshipBack: req.files?.citizenshipBack?.[0]?.path || "",
      photo: req.files?.photo?.[0]?.path || "",
    };

    const newDriver = new Driver(driverData);
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(500).json({ error: "Failed to add driver" });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.licenseAttachment) {
      updateData.licenseAttachment = req.files.licenseAttachment[0].path;
    }
    if (req.files?.citizenshipFront) {
      updateData.citizenshipFront = req.files.citizenshipFront[0].path;
    }
    if (req.files?.citizenshipBack) {
      updateData.citizenshipBack = req.files.citizenshipBack[0].path;
    }
    if (req.files?.photo) {
      updateData.photo = req.files.photo[0].path;
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });

    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: "Failed to update driver" });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete driver" });
  }
};
