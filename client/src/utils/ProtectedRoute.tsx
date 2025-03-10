import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};
const ProtectedRoute = ({ children }:Props) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // if (!user?.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }
  return children;
};

export default ProtectedRoute;