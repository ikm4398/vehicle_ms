import React, { useState, useEffect } from "react";
import "./addDriverModal.css";
import ConvertDate from "../calendar/ConvertDate"; // make sure path is correct

const AddDriverModal = ({ isOpen, onClose, onSave, editingDriver }) => {
  const [formData, setFormData] = useState({
    name: "",
    joiningDate: "",
    mobile: "",
    address: "",
    licenseAttachment: null,
    citizenshipFront: null,
    citizenshipBack: null,
    photo: null,
  });

  useEffect(() => {
    if (editingDriver) {
      setFormData({
        name: editingDriver.name || "",
        joiningDate: editingDriver.joiningDate || "", // AD date from DB
        mobile: editingDriver.mobile || "",
        address: editingDriver.address || "",
        licenseAttachment: null,
        citizenshipFront: null,
        citizenshipBack: null,
        photo: null,
      });
    } else {
      setFormData({
        name: "",
        joiningDate: "",
        mobile: "",
        address: "",
        licenseAttachment: null,
        citizenshipFront: null,
        citizenshipBack: null,
        photo: null,
      });
    }
  }, [editingDriver]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <span className="modal-close" onClick={onClose}>
          &times;
        </span>
        <h2>{editingDriver ? "Edit Driver" : "Add Driver"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Driver Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Joining Date
            <ConvertDate
              id="joining-date"
              value={formData.joiningDate} // AD value
              placeholder="Select Nepali Date"
              onChange={(adDate) =>
                setFormData({ ...formData, joiningDate: adDate })
              }
            />
          </label>

          <label>
            Mobile No
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            License Attachment
            <input
              type="file"
              name="licenseAttachment"
              onChange={handleChange}
            />
          </label>

          <label>
            Citizenship Front
            <input
              type="file"
              name="citizenshipFront"
              onChange={handleChange}
            />
          </label>

          <label>
            Citizenship Back
            <input
              type="file"
              name="citizenshipBack"
              onChange={handleChange}
            />
          </label>

          <label>
            Photo
            <input type="file" name="photo" onChange={handleChange} />
          </label>

          <div className="modal-buttons">
            <button type="submit">{editingDriver ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriverModal;
