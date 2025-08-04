import React from "react";

const DashboardTable = ({
  data,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  onEditClick,
}) => {
  return (
    <>
      <input
        type="search"
        placeholder="Search units..."
        className="search-box"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Unit ID</th>
            <th>Vehicle Number</th>
            <th>Type</th>
            <th>Working at Site</th>
            <th>Arrival Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.number}</td>
                <td>{row.type}</td>
                <td>{row.site}</td>
                <td>{row.date}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => onEditClick(row.id)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default DashboardTable;
