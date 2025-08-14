import React, { useState, useEffect } from "react";
import API_URL from "../../../config/apiConfig";
import ConvertDate from "../../calendar/ConvertDate";
import VEHICLE_STATUS from "./vehicleStatus";
import "./vehicleModal.css";

// UpdateVehicleModal component for adding or editing vehicle details
const UpdateVehicleModal = ({ vehicle, onClose, onSave }) => {
  // State for form data, initialized with vehicle prop or empty object
  const [formData, setFormData] = useState(vehicle || {});
  // State for success and error messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // State for vehicle types fetched from API
  const [vehicleTypes, setVehicleTypes] = useState([]);
  // State for loading status during API calls
  const [isLoading, setIsLoading] = useState(false);

  // Reset form data and messages when vehicle prop changes
  useEffect(() => {
    setFormData(vehicle || {});
    setMessage("");
    setError("");
  }, [vehicle]);

  // Fetch vehicle types from API on component mount
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/vehicle-types`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setVehicleTypes(data);
      } catch (err) {
        console.error("Error fetching vehicle types:", err);
        setError("Failed to load vehicle types. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  // Handle input changes and update formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding or updating vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const url = formData._id
        ? `${API_URL}/api/vehicles/${formData._id}`
        : `${API_URL}/api/vehicles`;
      const method = formData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save vehicle.");
      }

      setMessage(
        formData._id
          ? "Vehicle updated successfully."
          : "Vehicle added successfully."
      );
      onSave();
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Error saving vehicle:", err);
      setError(err.message || "An error occurred while saving the vehicle.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>{formData._id ? "Edit Vehicle" : "Add Vehicle"}</h2>
        {isLoading && <div className="loading-message">Processing...</div>}
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Unit ID:
            <input
              name="unit_id"
              value={formData.unit_id || ""}
              onChange={handleChange}
              required
              readOnly
            />
          </label>
          <label>
            Registration Number:
            <input
              name="vehicle_registration_number"
              value={formData.vehicle_registration_number || ""}
              onChange={handleChange}
              required
              readOnly
            />
          </label>
          <label>
            Vehicle Type:
            <select
              name="vehicle_type"
              value={formData.vehicle_type || ""}
              onChange={handleChange}
              disabled={isLoading}
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
                    last_paid_date: adDate,
                  },
                })
              }
              disabled={isLoading}
            />
          </label>
          <label>
            Blue Book / Tax Date:
            <ConvertDate
              id="tax-date"
              value={formData.tax_details?.last_paid_date || ""}
              placeholder="Select Blue Book / Tax Date"
              onChange={(adDate) =>
                setFormData({
                  ...formData,
                  tax_details: {
                    ...formData.tax_details,
                    last_paid_date: adDate,
                  },
                })
              }
              disabled={isLoading}
            />
          </label>
          <label>
            Status:
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </label>
          <div className="modal-buttons">
            <button type="submit" disabled={isLoading}>
              {formData._id ? "Update" : "Save"}
            </button>
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVehicleModal;