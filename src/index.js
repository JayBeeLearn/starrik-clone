
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate,useNavigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import UserLayout from "layouts/User.js";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Homerouting from "layouts/Homerouting";
import { GlobalState } from "Globalstate";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalState>
  <BrowserRouter>
    <Routes>
    <Route path="/" element={<Homerouting />} />
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/user/*" element={<UserLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
  </GlobalState>
);
