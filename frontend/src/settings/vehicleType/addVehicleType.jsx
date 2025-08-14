import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import API_URL from "../../config/apiConfig";
import "./addVehicleType.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const AddVehicleType = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tableHeight, setTableHeight] = useState("400px");

  const fetchVehicleTypes = async () => {
    const res = await fetch(`${API_URL}/api/vehicle-types`);
    const data = await res.json();
    setVehicleTypes(data);
  };

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const calculateTableHeight = () => {
    const headerHeight = 80;
    const padding = 40;
    setTableHeight(`${window.innerHeight - headerHeight - padding}px`);
  };

  useEffect(() => {
    calculateTableHeight();
    window.addEventListener("resize", calculateTableHeight);
    return () => window.removeEventListener("resize", calculateTableHeight);
  }, []);

  const customStyles = {
    headCells: { style: { fontSize: "18px", fontWeight: "600" } },
    cells: { style: { fontSize: "16px" } },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/api/vehicle-types/${editingId}`
        : `${API_URL}/api/vehicle-types`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save vehicle type");

      setFormData({ name: "", description: "" });
      setEditingId(null);
      setMessage(editingId ? "Updated successfully" : "Added successfully");
      fetchVehicleTypes();
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Error saving vehicle type");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleEdit = (type) => {
    setFormData({ name: type.name ?? "", description: type.description ?? "" });
    setEditingId(type._id);
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_URL}/api/vehicle-types/${id}`, { method: "DELETE" });
    fetchVehicleTypes();
  };

  const columns = [
    { name: "Vehicle Type", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button className="edit-button" onClick={() => handleEdit(row)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="delete-button"
            onClick={() => handleDelete(row._id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="unit-content">
      <h2>Vehicle Types</h2>

      {message && <p className="message">{message}</p>}

      <form className="vehicle-type-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Type"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <DataTable
        columns={columns}
        data={vehicleTypes}
        fixedHeader
        fixedHeaderScrollHeight={tableHeight}
        highlightOnHover
        dense
        noHeader
        customStyles={customStyles}
        pagination={false}
      />
    </div>
  );
};

export default AddVehicleType;
