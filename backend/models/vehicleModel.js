const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    vehicle_registration_number: { type: String, required: true, unique: true },
    unit_id: { type: Number, required: true },
    vehicle_type: String,
    working_site: String,
    arrival_date: String,
    insurance_details: {
      last_paid_date: String,
    },
    tax_details: {
      last_paid_date: String,
    },
    status: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
