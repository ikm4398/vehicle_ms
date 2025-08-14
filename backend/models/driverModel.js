const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    licenseAttachment: {
      type: String,
    },
    citizenshipFront: {
      type: String,
    },
    citizenshipBack: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
