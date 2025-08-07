import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import API_URL from "../config/apiconfig";
import AddVehicleModal from "../components/modals/AddVehicleModal";
import "./units.css";
import { vehicleTypeOptions } from "./vehicleTypes";

const PAGE_SIZE = 10;

const Units = () => {
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fetchCombinedData = async () => {
    try {
      const [unitsRes, vehiclesRes] = await Promise.all([
        fetch(`${API_URL}/units`),
        fetch(`${API_URL}/api/vehicles`),
      ]);
      const unitsData = await unitsRes.json();
      const vehiclesData = await vehiclesRes.json();

      if (unitsData.success && Array.isArray(unitsData.data)) {
        const unitsList = unitsData.data;
        const vehiclesList = Array.isArray(vehiclesData) ? vehiclesData : [];

        const merged = unitsList.map((unit) => {
          const matchingVehicle = vehiclesList.find(
            (v) =>
              v.unit_id === unit.unit_id ||
              v.vehicle_registration_number === unit.vehicle_registration_number
          );
          return {
            ...unit,
            vehicle_type: matchingVehicle?.vehicle_type || "",
            working_site: matchingVehicle?.working_site || "",
            arrival_date: matchingVehicle?.arrival_date || "",
            status: matchingVehicle?.status || "",
            insurance_details: matchingVehicle?.insurance_details || {
              last_paid_date: "",
            },
            tax_details: matchingVehicle?.tax_details || { last_paid_date: "" },
            full_vehicle_data: matchingVehicle || null,
          };
        });

        setUnits(merged);
      }
    } catch (error) {
      console.error("Failed to fetch units or vehicles:", error);
    }
  };

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const filteredUnits = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return units.filter(
      (u) =>
        u.vehicle_registration_number?.toLowerCase().includes(q) ||
        u.unit_id?.toString().includes(q)
    );
  }, [searchQuery, units]);

  const totalPages = Math.ceil(filteredUnits.length / PAGE_SIZE);
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredUnits.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredUnits, currentPage]);

  const handleAddClick = (unit) => {
    setSelectedUnit({
      unit_id: unit.unit_id,
      vehicle_registration_number: unit.vehicle_registration_number,
      vehicle_type: unit.vehicle_type || "",
      working_site: unit.working_site || "",
      arrival_date: unit.arrival_date || "",
      status: unit.status || "",
      insurance_details: unit.insurance_details || { last_paid_date: "" },
      tax_details: unit.tax_details || { last_paid_date: "" },
      _id: unit.full_vehicle_data?._id || null,
    });
    setShowModal(true);
  };
  const getVehicleTypeLabel = (value) => {
    const found = vehicleTypeOptions.find((vt) => vt.value === value);
    return found ? found.label : value || "-";
  };

  return (
    <div>
      <Header />
      <div className="unit-content">
        <h2>Unit List</h2>
        <input
          type="text"
          placeholder="Search by vehicle number or unit ID..."
          className="search-box"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className="unit-table">
          <thead>
            <tr>
              <th>Unit ID</th>
              <th>Vehicle Registration Number</th>
              <th>Vehicle Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((unit) => (
                <tr key={unit.unit_id}>
                  <td>{unit.unit_id}</td>
                  <td>{unit.vehicle_registration_number}</td>
                  <td>{getVehicleTypeLabel(unit.vehicle_type)}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleAddClick(unit)}
                    >
                      ADD
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No matching units found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && selectedUnit && (
        <AddVehicleModal
          vehicle={selectedUnit}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchCombinedData();
          }}
        />
      )}
    </div>
  );
};

export default Units;
