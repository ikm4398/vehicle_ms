import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import API_URL from "../config/apiConfig";
import "./driver.css";
import AddDriverModal from "../components/modals/addDriverModal";
import { adToBs } from "@sbmdkl/nepali-date-converter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState("");
  const [editingDriver, setEditingDriver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableHeight, setTableHeight] = useState("400px");

  const fetchDrivers = async () => {
    const res = await fetch(`${API_URL}/api/drivers`);
    const data = await res.json();
    setDrivers(data);
  };

  useEffect(() => {
    fetchDrivers();
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

  const handleSave = async (formData) => {
    try {
      const method = editingDriver ? "PUT" : "POST";
      const url = editingDriver
        ? `${API_URL}/api/drivers/${editingDriver._id}`
        : `${API_URL}/api/drivers`;

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const res = await fetch(url, { method, body: formDataToSend });
      if (!res.ok) throw new Error("Failed to save driver");

      setMessage(editingDriver ? "Updated successfully" : "Added successfully");
      setTimeout(() => setMessage(""), 1500);

      fetchDrivers();
      setIsModalOpen(false);
      setEditingDriver(null);
    } catch (err) {
      console.error(err);
      setMessage("Error saving driver");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_URL}/api/drivers/${id}`, { method: "DELETE" });
    fetchDrivers();
  };
  const columns = [
    {
      name: "Photo",
      selector: (row) => row.photo,
      cell: (row) => {
        const defaultAvatar =
          "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
        const imageUrl = row.photo ? `${API_URL}/${row.photo}` : defaultAvatar;

        return (
          <img
            src={imageUrl}
            alt={row.name || "No name"}
            style={{
              width: "75px",
              height: "75px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            onError={(e) => {
              if (e.target.src !== defaultAvatar) {
                console.error(`Failed to load image: ${imageUrl}`);
                e.target.src = defaultAvatar;
              }
            }}
          />
        );
      },
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    {
      name: "Joining Date",
      selector: (row) => {
        if (!row.joiningDate) return "";
        try {
          return adToBs(row.joiningDate.split("T")[0]); // show BS date
        } catch {
          return "";
        }
      },
      sortable: true,
    },
    { name: "Mobile", selector: (row) => row.mobile },
    { name: "Address", selector: (row) => row.address },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            className="driver-edit-button"
            onClick={() => handleEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className="driver-delete-button"
            onClick={() => handleDelete(row._id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="driver-content">
      <h2>Drivers</h2>

      {message && <p className="driver-message">{message}</p>}

      <button
        className="add-driver-btn"
        onClick={() => {
          setEditingDriver(null);
          setIsModalOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add Driver
      </button>

      <DataTable
        columns={columns}
        data={drivers}
        fixedHeader
        fixedHeaderScrollHeight={tableHeight}
        customStyles={customStyles}
        highlightOnHover
        dense
        noHeader
        pagination={false}
      />

      <AddDriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingDriver={editingDriver}
      />
    </div>
  );
};

export default Driver;
