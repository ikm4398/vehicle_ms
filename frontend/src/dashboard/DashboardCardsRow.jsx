import React from "react";
import DashboardCard from "./DashboardCard";
import {
  faTruck,
  faCar,
  faStopCircle,
  faStore,
  faTools,
  faShieldAlt,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const DashboardCardsRow = ({ totals, onCardClick, unitListLength }) => (
  <div className="card-row">
    <DashboardCard
      label="Total Vehicle"
      value={unitListLength || "--"}
      icon={faTruck}
      onClick={() => onCardClick("Total Vehicle")}
    />
    <DashboardCard
      label="Total Running"
      value={totals.totalRunning}
      icon={faCar}
      onClick={() => onCardClick("Total Running")}
    />
    <DashboardCard
      label="Total at Bekat"
      value={totals.totalBekat}
      icon={faStopCircle}
      onClick={() => onCardClick("Total Bekat")}
    />
    <DashboardCard
      label="Total at Breakdown"
      value={totals.totalBreakdown}
      icon={faStore}
      onClick={() => onCardClick("Total Breakdown")}
    />
    <DashboardCard
      label="Total at Maintenance"
      value={totals.totalMaintenance}
      icon={faTools}
      onClick={() => onCardClick("Total Maintenance")}
    />
    <DashboardCard
      label="Total Insurance Expired"
      value={totals.insuranceExpired}
      icon={faShieldAlt}
      onClick={() => onCardClick("Total Insurance Expired")}
    />
    <DashboardCard
      label="Total Bluebook Renew Expired"
      value={totals.taxExpired}
      icon={faBook}
      onClick={() => onCardClick("Total Bluebook Renew Expired")}
    />
  </div>
);

export default DashboardCardsRow;
