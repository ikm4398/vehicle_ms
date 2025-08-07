import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./dashboard/dashboard";
import AddVehicle from "./vehicle/addVehicle";
import Units from "./units/units";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/addvehicle" element={<AddVehicle />} />
      <Route path="/units" element={<Units />} />
    </Routes>
  );
};

export default App;
