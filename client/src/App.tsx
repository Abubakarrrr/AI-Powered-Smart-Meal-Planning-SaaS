import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "@/pages/Home";
import {
  Login,
  Signup,
  Profile,
  EmailVerify,
  ResetPassword,
  ForgotPassword,
} from "@/components/Forms";
import { Toaster } from "@/components/ui/toaster";
import RedirectAuthenticatedUser from "@/utils/RedirectAuthenticatedUser";
import ProtectedRoute from "./utils/ProtectedRoute";
import PageNotFound from "@/components/shared/PageNotFound";

function App() {
  return (
    <>
      <div className="font-primary">
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <Signup />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-verify"
            element={
              <RedirectAuthenticatedUser>
                <EmailVerify />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
  </>
  );
}

export default App;
