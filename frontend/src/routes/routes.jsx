import React from "react";
import { Route, Routes } from "react-router-dom";

import DashBoard from "../dashboard/DashboardContainer";
import AddVehicle from "../vehicle/addVehicle";
import Units from "../units/units";
import AddVehicleType from "../settings/vehicleType/addVehicleType";
import Driver from "../drivers/driver";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashBoard/>} />
      <Route path="/add-vehicles" element={<AddVehicle />} />
      <Route path="/units" element={<Units />} />
      <Route path="/drivers" element={<Driver />} />
      <Route path="/settings/add-vehicle-types" element={<AddVehicleType />} />
    </Routes>
  );
};

export default App;
