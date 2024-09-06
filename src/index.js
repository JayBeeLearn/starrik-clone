import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import UserLayout from "layouts/User.js";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/AuthLayout.js";
import Homerouting from "layouts/Homerouting";
import CompLayout from "layouts/Company";
import CompRiderLayout from "layouts/CompanyRiders";

import { GlobalProvider } from "Globalstate";
import Company from "layouts/Company";
import AboutUs from "views/AboutUs";
import ContactUs from "views/ContactUs";
import TermsAndCondition from "views/TermsAndCondition";
import UserTerms from "components/termsAndConditions/UserTerms";
import RiderTerms from "components/termsAndConditions/RiderTerms";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homerouting />} index/>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/company/*" element={<CompLayout />} />
        <Route path="/companyriders/*" element={<CompRiderLayout />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndCondition />}>
          <Route
            path="/terms-and-conditions/user"
            element={<UserTerms />}
            index
          />
          <Route path="/terms-and-conditions/rider" element={<RiderTerms />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  </GlobalProvider>
);
