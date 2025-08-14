import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./header.css";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="dashboard-title">Units Dashboard</div>
      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/units"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Units
        </NavLink>
        <NavLink
          to="/drivers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Drivers
        </NavLink>
        <NavLink
          to="/cal"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Reports
        </NavLink>

        {/* Settings dropdown */}
        <div
          className="dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <span className="settings-label">Settings ▾</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <NavLink
                to="/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                General Settings
              </NavLink>
              <NavLink
                to="/settings/add-vehicle-types"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Vehicle Type
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
