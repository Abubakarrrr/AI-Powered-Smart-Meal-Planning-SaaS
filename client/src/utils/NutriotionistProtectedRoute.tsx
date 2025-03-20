import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};

const NutriotionistProtectedRoute = ({ children }:Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "nutritionist") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default NutriotionistProtectedRoute;