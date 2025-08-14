import React, { useState, useEffect, useCallback } from "react";
import API_URL from "../config/apiConfig";
import "./addVehicle.css";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicle_registration_number: "",
    insurance_last_paid_date: "",
    tax_last_paid_date: "",
    status: "",
    unit_id: "",
    vehicle_type: "",
    working_site: "",
    arrival_date: "",
  });

  const [units, setUnits] = useState([]);
  const [existingVehicles, setExistingVehicles] = useState([]);
  const [submitStatus, setSubmitStatus] = useState("");

  // Fetch unit list from API
  const fetchUnits = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/units`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setUnits(json.data);
      } else {
        console.error("Invalid units data format");
      }
    } catch (err) {
      console.error("Failed to fetch units:", err);
    }
  }, []);

  // Fetch already-registered vehicles
  const fetchExistingVehicles = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/vehicles`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const regNumbers = data.map((v) => v.vehicle_registration_number);
        setExistingVehicles(regNumbers);
      }
    } catch (err) {
      console.error("Error fetching existing vehicles:", err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchUnits();
    fetchExistingVehicles();
  }, [fetchUnits, fetchExistingVehicles]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      vehicle_registration_number: formData.vehicle_registration_number,
      unit_id: formData.unit_id,
      insurance_details: {
        last_paid_date: formData.insurance_last_paid_date || null,
      },
      tax_details: {
        last_paid_date: formData.tax_last_paid_date || null,
      },
      status: formData.status,
      vehicle_type: formData.vehicle_type,
      working_site: formData.working_site,
      arrival_date: formData.arrival_date || null,
    };

    try {
      const res = await fetch(`${API_URL}/api/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitStatus("Vehicle added successfully.");
        setFormData({
          vehicle_registration_number: "",
          insurance_last_paid_date: "",
          tax_last_paid_date: "",
          status: "",
          unit_id: "",
          vehicle_type: "",
          working_site: "",
          arrival_date: "",
        });

        await fetchExistingVehicles(); // Refresh list to exclude newly added vehicle
      } else {
        const err = await res.json();
        setSubmitStatus(`Error: ${err.message || "Could not add vehicle."}`);
      }
    } catch (err) {
      setSubmitStatus(`Error: ${err.message}`);
    }
  };

  const availableVehicles = units.filter(
    (unit) => !existingVehicles.includes(unit.vehicle_registration_number)
  );

  return (
    <>
      <div className="add-vehicle-form-wrapper">
        <h2>Add New Vehicle</h2>

        <form onSubmit={handleSubmit} className="addvehicle-form">
          {/* Vehicle Registration Number */}
          <div className="form-group">
            <label htmlFor="vehicle_registration_number" className="label-bold">
              Vehicle Registration Number *
            </label>
            <select
              id="vehicle_registration_number"
              name="vehicle_registration_number"
              value={formData.vehicle_registration_number}
              onChange={(e) => {
                const selectedReg = e.target.value;
                const selectedUnit = units.find(
                  (u) => u.vehicle_registration_number === selectedReg
                );
                setFormData((prev) => ({
                  ...prev,
                  vehicle_registration_number: selectedReg,
                  unit_id: selectedUnit?.unit_id || "",
                }));
              }}
              required
              className="input-field"
            >
              <option value="">-- Select Vehicle --</option>
              {availableVehicles.map((unit) => (
                <option
                  key={unit.unit_id}
                  value={unit.vehicle_registration_number}
                >
                  {unit.vehicle_registration_number}
                </option>
              ))}
            </select>
          </div>

          {/* Insurance Paid Date */}
          <div className="form-group">
            <label htmlFor="insurance_last_paid_date" className="label-bold">
              Insurance Last Paid Date
            </label>
            <input
              type="date"
              id="insurance_last_paid_date"
              name="insurance_last_paid_date"
              value={formData.insurance_last_paid_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Tax Paid Date */}
          <div className="form-group">
            <label htmlFor="tax_last_paid_date" className="label-bold">
              Tax Last Paid Date
            </label>
            <input
              type="date"
              id="tax_last_paid_date"
              name="tax_last_paid_date"
              value={formData.tax_last_paid_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="label-bold">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Running">Running</option>
              <option value="Breakdown">Breakdown</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Bekat">Bekat</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div className="form-group">
            <label htmlFor="vehicle_type" className="label-bold">
              Vehicle Type
            </label>
            <select
              id="vehicle_type"
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">-- Select Vehicle Type --</option>
              <option value="Type A">Type A</option>
              <option value="Type B">Type B</option>
              <option value="Type C">Type C</option>
              <option value="Type D">Type D</option>
            </select>
          </div>
          {/* Insurance Paid Date */}
          <div className="form-group">
            <label htmlFor="working_site" className="label-bold">
              Working At Site
            </label>
            <input
              type="text"
              id="working_site"
              name="working_site"
              value={formData.working_site}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          {/* Tax Paid Date */}
          <div className="form-group">
            <label htmlFor="arrival_date" className="label-bold">
              Arrival Date
            </label>
            <input
              type="date"
              id="arrival_date"
              name="arrival_date"
              value={formData.arrival_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          {/* Submit */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Save Vehicle
            </button>
          </div>
        </form>

        {submitStatus && (
          <div
            className={`toast-message ${
              submitStatus.toLowerCase().startsWith("error")
                ? "error"
                : "success"
            }`}
          >
            {submitStatus}
          </div>
        )}
      </div>
    </>
  );
};

export default AddVehicle;
