import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const AdminProtectedRoute = ({ children }:Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  // if (!user.status) {
  //   return <Navigate to="/email-verify" replace />;
  // }
  return children;
};

export default AdminProtectedRoute;