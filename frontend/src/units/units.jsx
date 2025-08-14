// export default Units;
import React, { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import API_URL from "../config/apiConfig";
import AddVehicleModal from "../components/modals/vehicleModal/addVehicleModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./units.css";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Units = () => {
  const [units, setUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableHeight, setTableHeight] = useState("400px"); // fallback

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

  // Dynamic table height calculation
  const calculateTableHeight = () => {
    const headerHeight = 80;
    const searchBox = document.querySelector(".unit-search-box");
    const searchHeight = searchBox ? searchBox.offsetHeight : 0;
    const padding = 40;
    setTableHeight(
      `${window.innerHeight - headerHeight - searchHeight - padding}px`
    );
  };

  useEffect(() => {
    calculateTableHeight();
    window.addEventListener("resize", calculateTableHeight);
    return () => window.removeEventListener("resize", calculateTableHeight);
  }, []);

  // Custom table styles
  const customStyles = {
    headCells: {
      style: {
        fontSize: "18px",
        fontWeight: "600",
        backgroundColor: "#f5f5f5",
      },
    },
    cells: {
      style: {
        fontSize: "16px",
        padding: "10px",
      },
    },
    table: {
      style: {
        minHeight: "300px",
      },
    },
  };

  const filteredUnits = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return units.filter(
      (u) =>
        u.vehicle_registration_number?.toLowerCase().includes(q) ||
        u.unit_id?.toString().includes(q)
    );
  }, [searchQuery, units]);

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

  const columns = [
    { name: "Unit ID", selector: (row) => row.unit_id, sortable: true },
    {
      name: "Vehicle Registration Number",
      selector: (row) => row.vehicle_registration_number,
      sortable: true,
    },
    {
      name: "Vehicle Type",
      selector: (row) => row.vehicle_type || "-", // directly show API value
    },
    {
      name: "Actions",
      cell: (row) => (
        <button className="edit-button" onClick={() => handleAddClick(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
    },
  ];

  return (
    <div className="unit-content">
      <h2>Unit List</h2>
      <input
        type="text"
        className="unit-search-box"
        placeholder="Search by vehicle number or unit ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <DataTable
        columns={columns}
        data={filteredUnits}
        fixedHeader
        fixedHeaderScrollHeight={tableHeight}
        highlightOnHover
        dense
        noHeader
        customStyles={customStyles}
        pagination={false}
      />

      {showModal && selectedUnit && (
        <AddVehicleModal
          vehicle={selectedUnit}
          onClose={() => setShowModal(false)}
          onSave={fetchCombinedData}
        />
      )}
    </div>
  );
};

export default Units;
