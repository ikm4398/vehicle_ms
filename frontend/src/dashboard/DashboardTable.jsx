import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";

// DashboardTable component to display vehicle data in a searchable table
const DashboardTable = ({ data, searchQuery, setSearchQuery, onEditClick }) => {
  // State for dynamic table height
  const [tableHeight, setTableHeight] = useState("500px");

  // Calculate table height based on window size
  const calculateTableHeight = () => {
    const headerHeight = 400;
    const searchBox = document.querySelector(".search-box");
    const searchHeight = searchBox ? searchBox.offsetHeight : 0;
    const padding = 40;
    const newHeight =
      window.innerHeight - headerHeight - searchHeight - padding;
    setTableHeight(`${newHeight > 300 ? newHeight : 300}px`);
  };

  // Set up and clean up window resize event listener
  useEffect(() => {
    calculateTableHeight();
    window.addEventListener("resize", calculateTableHeight);
    return () => window.removeEventListener("resize", calculateTableHeight);
  }, []);

  // Filter table data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(
      (unit) =>
        unit.id?.toLowerCase().includes(q) ||
        unit.number?.toLowerCase().includes(q) ||
        unit.type?.toLowerCase().includes(q) ||
        unit.site?.toLowerCase().includes(q) ||
        unit.date?.toLowerCase().includes(q)
    );
  }, [searchQuery, data]);

  // Define table columns
  const columns = useMemo(
    () => [
      { name: "Unit ID", selector: (row) => row.id, sortable: true },
      { name: "Vehicle Number", selector: (row) => row.number, sortable: true },
      { name: "Type", selector: (row) => row.type, sortable: true },
      { name: "Working at Site", selector: (row) => row.site, sortable: true },
      { name: "Arrival Date", selector: (row) => row.date, sortable: true },
      {
        name: "Action",
        cell: (row) => (
          <button
            className="edit-button"
            onClick={() => onEditClick(row.id)}
            aria-label={`Edit vehicle ${row.number}`}
          >
            Update
          </button>
        ),
        ignoreRowClick: true,
      },
    ],
    [onEditClick]
  );

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

  return (
    <div className="dashboard-table-container">
      <input
        type="search"
        placeholder="Search units..."
        className="search-box"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search vehicles"
      />
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        noHeader
        fixedHeader
        fixedHeaderScrollHeight={tableHeight}
        highlightOnHover
        dense={false}
        persistTableHead
        pagination={false}
        noDataComponent={<div>No vehicles found.</div>}
      />
    </div>
  );
};

export default DashboardTable;
