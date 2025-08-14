import React, { useState, useEffect } from "react";
import API_URL from "../../../config/apiConfig";
import "./vehicleModal.css";
import ConvertDate from "../../calendar/ConvertDate";
import VEHICLE_STATUS from "./vehicleStatus";

const AddVehicleModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState(vehicle || {});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);

  // Update form data when vehicle prop changes
  useEffect(() => {
    setFormData(vehicle || {});
    setMessage("");
    setError("");
  }, [vehicle]);

  // Fetch vehicle types from API
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/vehicle-types`);
        if (res.ok) {
          const data = await res.json();
          setVehicleTypes(data);
        } else {
          console.error("Failed to fetch vehicle types");
        }
      } catch (err) {
        console.error("Error fetching vehicle types:", err);
      }
    };
    fetchVehicleTypes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (formData._id) {
        res = await fetch(`${API_URL}/api/vehicles/${formData._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch(`${API_URL}/api/vehicles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setMessage(
          formData._id
            ? "Vehicle updated successfully."
            : "Vehicle added successfully."
        );
        setError("");
        onSave();
        setTimeout(() => onClose(), 500);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save vehicle.");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving vehicle.");
      setMessage("");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>{formData._id ? "Edit Vehicle" : "Add Vehicle"}</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {" "}
          <label>
            Unit ID:
            <input
              name="unit_id"
              value={formData.unit_id || ""}
              onChange={handleChange}
              readOnly
              required
            />
          </label>
          <label>
            Registration Number:
            <input
              name="vehicle_registration_number"
              value={formData.vehicle_registration_number || ""}
              onChange={handleChange}
              readOnly
              required
            />
          </label>
          <label>
            Vehicle Type:
            <select
              name="vehicle_type"
              value={formData.vehicle_type || ""}
              onChange={handleChange}
            >
              <option value="">-- Select Vehicle Type --</option>
              {vehicleTypes.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Insurance Date:
            <ConvertDate
              id="insurance-date"
              value={formData.insurance_details?.last_paid_date || ""}
              placeholder="Select Insurance Date"
              onChange={(adDate) =>
                setFormData({
                  ...formData,
                  insurance_details: {
                    ...formData.insurance_details,
                    last_paid_date: adDate, // only save AD date
                  },
                })
              }
            />
          </label>
          <label>
            Blue Book Date:
            <ConvertDate
              id="tax-date"
              value={formData.tax_details?.last_paid_date || ""}
              placeholder="Select Blue Book Date"
              onChange={(adDate) =>
                setFormData({
                  ...formData,
                  tax_details: {
                    ...formData.tax_details,
                    last_paid_date: adDate, // save AD
                  },
                })
              }
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              {VEHICLE_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Working Site:
            <input
              name="working_site"
              value={formData.working_site || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Arrival Date:
            <ConvertDate
              id="arrival-date"
              value={formData.arrival_date || ""}
              placeholder="Select Arrival Date"
              onChange={(adDate) =>
                setFormData({ ...formData, arrival_date: adDate })
              }
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">{formData._id ? "Update" : "Save"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
