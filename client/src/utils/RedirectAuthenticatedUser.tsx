import { useAuthStore } from "@/store/authStore";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: ReactNode;
};
const RedirectAuthenticatedUser = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RedirectAuthenticatedUser;
