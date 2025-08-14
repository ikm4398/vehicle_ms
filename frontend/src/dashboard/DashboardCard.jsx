import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DashboardCard = ({ label, value = "--", icon, onClick }) => (
  <div
    className="dashboard-card"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}
  >
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
