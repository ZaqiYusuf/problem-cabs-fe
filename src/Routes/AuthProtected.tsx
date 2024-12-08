import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AuthProtectedProps {
  children: ReactNode;
  allowedRoles?: string[]; // Role yang diizinkan
}

const AuthProtected: React.FC<AuthProtectedProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const authUser = localStorage.getItem("authUser");

  // Debugging: Cek apakah pengguna terautentikasi
  console.debug("AuthProtected: Checking authUser:", authUser);

  // Jika pengguna belum login
  if (!authUser) {
    console.warn("AuthProtected: User is not authenticated. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.debug("AuthProtected: Checking authUser:", authUser);


  // Parse data pengguna dari localStorage
  let user = null;
  try {
    user = JSON.parse(authUser);
    console.debug("AuthProtected: Parsed user data:", user);
  } catch (err) {
    console.error("AuthProtected: Failed to parse user data from localStorage:", err);
    return <Navigate to="/login" replace />;
  }
  
  // Jika user null setelah parsing
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  

  // Validasi role pengguna
  if (allowedRoles && !allowedRoles.includes(user.level)) {
    console.warn(
      `AuthProtected: User role (${user.level}) not allowed. Redirecting to appropriate page.`
    );
    // Redirect berdasarkan level pengguna
    switch (user.level) {
      case "admin":
        return <Navigate to="/dashboard-analytics" replace />;
      case "user":
        return <Navigate to="/payments-management-user" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtected;
