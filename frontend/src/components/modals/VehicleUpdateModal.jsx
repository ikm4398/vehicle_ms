// import React, { useState, useEffect } from "react";
// import API_URL from "../../config/apiconfig";
// import "./vehicleUpdateModal.css";
// import NepaliDatePicker from "../calendar/nepaliDatePicker";

// const VehicleUpdateModal = ({ vehicle, onClose, onSave }) => {
//   const [formData, setFormData] = useState(vehicle || {});
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setFormData(vehicle || {});
//     setMessage("");
//     setError("");
//   }, [vehicle]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_URL}/api/vehicles/${vehicle._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setMessage("Vehicle updated successfully.");
//         setError("");
//         onSave();
//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } else {
//         const data = await res.json();
//         setError(data.message || "Failed to update vehicle.");
//         setMessage("");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while updating.");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <h2>Update Vehicle</h2>
//         {message && <div className="success-message">{message}</div>}
//         {error && <div className="error-message">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <label>
//             Registration Number:
//             <input
//               name="vehicle_registration_number"
//               value={formData.vehicle_registration_number || ""}
//               onChange={handleChange}
//               required
//               readOnly
//             />
//           </label>
//           {/* <label>
//             Insurance Date:
//             <input
//               type="date"
//               name="insurance_last_paid_date"
//               value={formData.insurance_details?.last_paid_date || ""}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   insurance_details: {
//                     ...formData.insurance_details,
//                     last_paid_date: e.target.value,
//                   },
//                 })
//               }
//             />
//           </label> */}
//           <label>
//             Insurance Date:
//             <NepaliDatePicker
//               id="insurance-date"
//               value={formData.insurance_details?.last_paid_date || ""}
//               placeholder="Select Nepali Insurance Date"
//               onChange={(val) =>
//                 setFormData({
//                   ...formData,
//                   insurance_details: {
//                     ...formData.insurance_details,
//                     last_paid_date: val,
//                   },
//                 })
//               }
//             />
//           </label>
//           {/* <label>
//             Tax Date:
//             <input
//               type="date"
//               name="tax_last_paid_date"
//               value={formData.tax_details?.last_paid_date || ""}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   tax_details: {
//                     ...formData.tax_details,
//                     last_paid_date: e.target.value,
//                   },
//                 })
//               }
//             />
//           </label> */}
//           <label>
//             Tax Date:
//             <NepaliDatePicker
//               id="tax-date"
//               value={formData.tax_details?.last_paid_date || ""}
//               placeholder="Select Nepali Tax Date"
//               onChange={(val) =>
//                 setFormData({
//                   ...formData,
//                   tax_details: {
//                     ...formData.tax_details,
//                     last_paid_date: val,
//                   },
//                 })
//               }
//             />
//           </label>
//           <label>
//             Status:
//             <select
//               name="status"
//               value={formData.status || ""}
//               onChange={handleChange}
//             >
//               <option value="">-- Select Status --</option>
//               <option value="Running">Running</option>
//               <option value="Bekat">Bekat</option>
//               <option value="Breakdown">Breakdown</option>
//               <option value="Maintenance">Maintenance</option>
//             </select>
//           </label>
//           <label>
//             Working Site:
//             <input
//               name="working_site"
//               value={formData.working_site || ""}
//               onChange={handleChange}
//             />
//           </label>

//           <label>
//             Vehicle Type:
//             <select
//               name="vehicle_type"
//               value={formData.vehicle_type}
//               onChange={handleChange}
//             >
//               <option value="">-- Select Vehicle Type --</option>
//               <option value="Type A">Type A</option>
//               <option value="Type B">Type B</option>
//               <option value="Type C">Type C</option>
//               <option value="Type D">Type D</option>
//             </select>
//           </label>
//           {/* <label>
//             Arrival Date:
//             <input
//               type="date"
//               name="arrival_date"
//               value={formData.arrival_date || ""}
//               onChange={handleChange}
//             />
//           </label> */}
//           <label>
//             Arrival Date:
//             <NepaliDatePicker
//               id="arrival-date"
//               value={formData.arrival_date || ""}
//               placeholder="Select Nepali Arrival Date"
//               onChange={(val) =>
//                 setFormData({
//                   ...formData,
//                   arrival_date: val,
//                 })
//               }
//             />
//           </label>
//           <div className="modal-buttons">
//             <button type="submit">Save</button>
//             <button type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default VehicleUpdateModal;
import React, { useState, useEffect } from "react";
import API_URL from "../../config/apiconfig";
import "./vehicleUpdateModal.css";
import NepaliDatePicker from "../calendar/nepaliDatePicker";

const VehicleUpdateModal = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState(vehicle || {});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(vehicle || {});
    setMessage("");
    setError("");
  }, [vehicle]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/vehicles/${vehicle._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Vehicle updated successfully.");
        setError("");
        onSave();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update vehicle.");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating.");
      setMessage("");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Update Vehicle</h2>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            Insurance Date:
            <div
              className="ndp-nepali-calendar-div"
              style={{ position: "relative" }}
            >
              <NepaliDatePicker
                id="insurance-date"
                value={formData.insurance_details?.last_paid_date || ""}
                placeholder="Select Nepali Insurance Date"
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    insurance_details: {
                      ...formData.insurance_details,
                      last_paid_date: val,
                    },
                  })
                }
              />
            </div>
          </label>
          <label>
            Tax Date:
            <div
              className="ndp-nepali-calendar-div"
              style={{ position: "relative" }}
            >
              <NepaliDatePicker
                id="tax-date"
                value={formData.tax_details?.last_paid_date || ""}
                placeholder="Select Nepali Tax Date"
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    tax_details: {
                      ...formData.tax_details,
                      last_paid_date: val,
                    },
                  })
                }
              />
            </div>
          </label>
          <label>
            Status:
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value="">-- Select Status --</option>
              <option value="Running">Running</option>
              <option value="Bekat">Bekat</option>
              <option value="Breakdown">Breakdown</option>
              <option value="Maintenance">Maintenance</option>
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
            Vehicle Type:
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
            >
              <option value="">-- Select Vehicle Type --</option>
              <option value="Type A">Type A</option>
              <option value="Type B">Type B</option>
              <option value="Type C">Type C</option>
              <option value="Type D">Type D</option>
            </select>
          </label>
          <label>
            Arrival Date:
            <div
              className="ndp-nepali-calendar-div"
              style={{ position: "relative" }}
            >
              <NepaliDatePicker
                id="arrival-date"
                value={formData.arrival_date || ""}
                placeholder="Select Nepali Arrival Date"
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    arrival_date: val,
                  })
                }
              />
            </div>
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleUpdateModal;
