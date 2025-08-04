import React from "react";
import { NavLink } from "react-router-dom"; // ✅ Use NavLink
import "./header.css";

const Header = () => (
  <header className="header">
    <div className="dashboard-title">Units Dashboard</div>
    <nav>
      <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
        Home
      </NavLink>
      <NavLink to="/addvehicle" className={({ isActive }) => isActive ? "active" : ""}>
        Units
      </NavLink>
      <NavLink to="/customers" className={({ isActive }) => isActive ? "active" : ""}>
        Customers
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>
        Reports
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
        Settings
      </NavLink>
    </nav>
  </header>
);

export default Header;
