import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./dashboard/dashboard";
import AddVehicle from "./vehicle/addVehicle";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/addvehicle" element={<AddVehicle />} />
    </Routes>
  );
};

export default App;
