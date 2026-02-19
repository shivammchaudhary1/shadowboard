import React from "react";
import { Routes, Route } from "react-router-dom";
import NotificationTest from "../pages/NotificationTest";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/notification-test" element={<NotificationTest />} />
      <Route path="/about" element={<div>About Page</div>} />
    </Routes>
  );
};

export default AppRoutes;
