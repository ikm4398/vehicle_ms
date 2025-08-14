import React from "react";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import "./totalStatsModal.css";

const TotalStatsModal = ({ isOpen, onClose, title, data, displayField }) => {
  if (!isOpen) return null;

  const getDateValue = (v) => {
    if (!displayField) return v.insurance_expired ? "Expired" : "Valid";

    const fieldParts = displayField.split("?.");
    let value = v;
    fieldParts.forEach((part) => {
      value = value ? value[part] : null;
    });

    if (!value) return "--";

    try {
      return adToBs(value);
    } catch {
      return value;  
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {data.length === 0 ? (
            <div className="no-data">No records found.</div>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Unit ID</th>
                  <th>Vehicle Number</th>
                  <th>Type</th>
                  <th>Site</th>
                  <th>Arrival Date</th>
                  <th>Status</th>
                  {displayField && <th>Last Paid Date</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((v, idx) => (
                  <tr key={idx}>
                    <td>{v.unit_id}</td>
                    <td>{v.vehicle_registration_number || "--"}</td>
                    <td>{v.vehicle_type || "--"}</td>
                    <td>{v.working_site || "--"}</td>
                    <td>{v.arrival_date_bs || "--"}</td>
                    <td>{v.status || "--"}</td>
                    {displayField && <td>{getDateValue(v)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalStatsModal;
