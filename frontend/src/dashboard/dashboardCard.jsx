import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DashboardCard = ({ label, value = "--", icon }) => (
  <div className="dashboard-card">
    <div className="card-icon-label">
      {icon && (
        <FontAwesomeIcon icon={icon} size="lg" style={{ color: "#234ef3" }} />
      )}
      <div className="card-label">{label}</div>
    </div>
    <div className="card-value">{value}</div>
  </div>
);

export default DashboardCard;
