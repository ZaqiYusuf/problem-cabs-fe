import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthProtected from "../Routes/AuthProtected";
import { authProtectedRoutes } from "../Routes/allRoutes";
import Login from "pages/Authentication/Login";
import Register from "pages/Register/Register";
import Layout from "Layout";
// import NonAuthLayout from "Layout/NonAuthLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/login" element={<Login />} />
      <Route path="/daftar" element={<Register />} />


      {/* Rute Dilindungi */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthProtected allowedRoles={route.roles}>
              <Layout>
                <route.component />
              </Layout>
            </AuthProtected>
          }
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
