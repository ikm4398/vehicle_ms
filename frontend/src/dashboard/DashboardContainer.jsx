import React, { useEffect, useMemo, useState } from "react";
import API_URL from "../config/apiConfig";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import DashboardCardsRow from "./DashboardCardsRow";
import DashboardTable from "./DashboardTable";
import UpdateVehicleModal from "../components/modals/vehicleModal/updateVehicleModal";
import TotalStatsModal from "../components/modals/totalStatsModal/totalStatsModal";
import "./Dashboard.css";
const DashboardContainer = () => {
  const [vehicles, setVehicles] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalDisplayField, setModalDisplayField] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehiclesAndUnits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [vehicleRes, unitRes] = await Promise.all([
        fetch(`${API_URL}/api/vehicles`),
        fetch(`${API_URL}/units`),
      ]);

      if (!vehicleRes.ok || !unitRes.ok)
        throw new Error("Failed to fetch data");

      const vehicleData = await vehicleRes.json();
      const unitData = await unitRes.json();

      setVehicles(vehicleData || []);
      setUnitList(unitData?.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesAndUnits();
  }, []);

  const isExpired = (lastPaid) => {
    if (!lastPaid) return false;
    const date = new Date(lastPaid);
    if (isNaN(date.getTime())) return false;
    return (new Date() - date) / (1000 * 60 * 60 * 24) > 365;
  };

  const safeAdToBs = (date) => {
    if (!date) return "--";
    try {
      return adToBs(date);
    } catch {
      return "--";
    }
  };

  const vehiclesWithBS = useMemo(
    () =>
      vehicles.map((v) => ({
        ...v,
        arrival_date_bs: safeAdToBs(v.arrival_date),
        insurance_expired: isExpired(v.insurance_details?.last_paid_date),
        tax_expired: isExpired(v.tax_details?.last_paid_date),
      })),
    [vehicles]
  );

  const totals = useMemo(() => {
    const stats = {
      totalRunning: 0,
      totalBekat: 0,
      totalBreakdown: 0,
      totalMaintenance: 0,
      insuranceExpired: 0,
      taxExpired: 0,
    };
    vehiclesWithBS.forEach((v) => {
      if (v.status === "Running") stats.totalRunning++;
      if (v.status === "Bekat") stats.totalBekat++;
      if (v.status === "Breakdown") stats.totalBreakdown++;
      if (v.status === "Maintenance") stats.totalMaintenance++;
      if (v.insurance_expired) stats.insuranceExpired++;
      if (v.tax_expired) stats.taxExpired++;
    });
    return stats;
  }, [vehiclesWithBS]);

  const handleEditClick = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.unit_id?.toString() === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowVehicleModal(true);
    }
  };

  const handleCardClick = (type) => {
    let filtered = [],
      title = "",
      displayField = null;
    switch (type) {
      case "Total Running":
        title = "Running Vehicles";
        filtered = vehiclesWithBS.filter((v) => v.status === "Running");
        break;
      case "Total Bekat":
        title = "Vehicles at Bekat";
        filtered = vehiclesWithBS.filter((v) => v.status === "Bekat");
        break;
      case "Total Breakdown":
        title = "Vehicles in Breakdown";
        filtered = vehiclesWithBS.filter((v) => v.status === "Breakdown");
        break;
      case "Total Maintenance":
        title = "Vehicles in Maintenance";
        filtered = vehiclesWithBS.filter((v) => v.status === "Maintenance");
        break;
      case "Total Insurance Expired":
        title = "Insurance Expired Vehicles";
        filtered = vehiclesWithBS.filter((v) => v.insurance_expired);
        displayField = "insurance_details?.last_paid_date";
        break;
      case "Total Bluebook Renew Expired":
        title = "Bluebook Expired Vehicles";
        filtered = vehiclesWithBS.filter((v) => v.tax_expired);
        displayField = "tax_details?.last_paid_date";
        break;
      default:
        return;
    }
    setModalTitle(title);
    setModalData(filtered);
    setModalOpen(true);
    setModalDisplayField(displayField);
  };

  const tableData = useMemo(
    () =>
      vehiclesWithBS.map((v) => ({
        id: v.unit_id?.toString() || "--",
        number: v.vehicle_registration_number || "--",
        type: v.vehicle_type || "--",
        site: v.working_site || "N/A",
        date: v.arrival_date_bs,
      })),
    [vehiclesWithBS]
  );

  return (
    <div className="dashboard-content">
      {isLoading && <div>Loading dashboard data...</div>}
      {error && <div className="error-message">{error}</div>}

      <DashboardCardsRow
        totals={totals}
        onCardClick={handleCardClick}
        unitListLength={unitList.length}
      />

      <DashboardTable
        data={tableData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEditClick={handleEditClick}
      />

      {showVehicleModal && selectedVehicle && (
        <UpdateVehicleModal
          vehicle={selectedVehicle}
          onClose={() => setShowVehicleModal(false)}
          onSave={fetchVehiclesAndUnits}
        />
      )}

      <TotalStatsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        data={modalData}
        displayField={modalDisplayField}
      />
    </div>
  );
};

export default DashboardContainer;
