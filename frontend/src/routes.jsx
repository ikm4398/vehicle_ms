import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./dashboard/dashboard";
import AddVehicle from "./vehicle/addVehicle";
import Units from "./units/units";
import AddVehicleType from "./setting/vehicleType/addVehicleType";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/addvehicle" element={<AddVehicle />} />
      <Route path="/units" element={<Units />} />
      <Route path="/setting/add-vehicle-type" element={<AddVehicleType />} />
    </Routes>
  );
};

export default App;
