import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import axios from "axios";
import AdminLayout from "layouts/AdminLayout.js";
import SaisieLayout from "layouts/SaisieLayout.js";
import AuthLayout from "layouts/Auth.js";
import Login from "views/Login.js";

import AdminL from "layouts/Admin.js";
import AuthL from "layouts/Auth.js";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";
axios.defaults.withCredentials = true;


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={<AdminLayout />}
        />

        <Route
          path="/saisie/*"
          element={<SaisieLayout />}
        />

        <Route path="/auth/*" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>

      
        <Route path="/exadmin/*" element={<AdminL />} />
        <Route path="/exauth/*" element={<AuthL />} />
            
        <Route
          path="/*"
          element={<Navigate to="/auth/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
