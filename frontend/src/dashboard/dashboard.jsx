import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import DashboardCard from "./dashboardCard";
import DashboardTable from "./dashboardTable";
import "./dashboard.css";
import API_URL from "../config/apiconfig";
import VehicleUpdateModal from "../components/modals/VehicleUpdateModal";

import {
  faStore,
  faShieldAlt,
  faTools,
  faTruck,
  faCar,
  faStopCircle,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.unit_id?.toString() === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  useEffect(() => {
    const fetchVehiclesAndUnits = async () => {
      try {
        const [vehicleRes, unitRes] = await Promise.all([
          fetch(`${API_URL}/api/vehicles`),
          fetch(`${API_URL}/units`),
        ]);

        const vehicleData = await vehicleRes.json();
        const unitData = await unitRes.json();

        if (Array.isArray(vehicleData)) setVehicles(vehicleData);
        if (unitData?.success && Array.isArray(unitData.data))
          setUnitList(unitData.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchVehiclesAndUnits();
  }, []);

  const now = new Date();
  const isExpired = (lastPaid) => {
    if (!lastPaid) return false;
    const date = new Date(lastPaid);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffDays > 365;
  };

  const totals = useMemo(() => {
    let insuranceExpired = 0,
      taxExpired = 0,
      totalRunning = 0,
      totalBekat = 0,
      totalBreakdown = 0,
      totalMaintenance = 0;

    vehicles.forEach((v) => {
      if (v.status === "Running") totalRunning++;
      if (v.status === "Bekat") totalBekat++;
      if (v.status === "Breakdown") totalBreakdown++;
      if (v.status === "Maintenance") totalMaintenance++;

      if (isExpired(v.insurance_details?.last_paid_date)) insuranceExpired++;
      if (isExpired(v.tax_details?.last_paid_date)) taxExpired++;
    });

    return {
      total: vehicles.length,
      totalRunning,
      totalBekat,
      totalBreakdown,
      totalMaintenance,
      insuranceExpired,
      taxExpired,
    };
  }, [vehicles]);

  const tableData = useMemo(() => {
    return vehicles.map((v) => ({
      id: v.unit_id?.toString() || "--",
      number: v.vehicle_registration_number || "--",
      type: v.vehicle_type || "--",
      site: v.working_site || "N/A",
      date: v.arrival_date
        ? new Date(v.arrival_date).toLocaleDateString()
        : "--",
    }));
  }, [vehicles]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;
    const q = searchQuery.toLowerCase();
    return tableData.filter(
      (unit) =>
        unit.id.toLowerCase().includes(q) ||
        unit.type.toLowerCase().includes(q) ||
        unit.site.toLowerCase().includes(q) ||
        unit.date.toLowerCase().includes(q)
    );
  }, [searchQuery, tableData]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredData]);

  return (
    <div>
      <Header />
      <div className="dashboard-content">
        <div className="card-row">
          <DashboardCard
            label="Total Vehicle"
            value={unitList.length || "--"}
            icon={faTruck}
          />
          <DashboardCard
            label="Total Running"
            value={totals.totalRunning}
            icon={faCar}
          />
          <DashboardCard
            label="Total at Bekat"
            value={totals.totalBekat}
            icon={faStopCircle}
          />
          <DashboardCard
            label="Total at Breakdown"
            value={totals.totalBreakdown}
            icon={faStore}
          />
          <DashboardCard
            label="Total at Maintenance"
            value={totals.totalMaintenance}
            icon={faTools}
          />
          <DashboardCard
            label="Total Insurance Expired"
            value={totals.insuranceExpired}
            icon={faShieldAlt}
          />
          <DashboardCard
            label="Total Blubook Renew expired"
            value={totals.taxExpired}
            icon={faDollarSign}
          />
        </div>

        <DashboardTable
          data={currentPageData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          onEditClick={handleEditClick}
        />
        {showModal && selectedVehicle && (
          <VehicleUpdateModal
            vehicle={selectedVehicle}
            onClose={handleModalClose}
            onSave={() => {
              setCurrentPage(1);
              fetch(`${API_URL}/api/vehicles`)
                .then((res) => res.json())
                .then((data) => {
                  if (Array.isArray(data)) setVehicles(data);
                });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
