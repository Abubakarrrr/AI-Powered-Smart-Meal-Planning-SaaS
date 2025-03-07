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
// import ProtectedRoute from "./utils/ProtectedRoute";
import PageNotFound from "@/components/shared/PageNotFound";
// import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import UserManagement from "@/components/dashboard/admin/users/UserManagement"
import UserProfileForm from "./pages/Goals";
// import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import MealCreationPage from "./pages/MealCreation";
import MealPlanner from "./pages/MealPlanner";
import MealsManagement from "@/components/dashboard/admin/meals/MealManagement";
import AddMealPage from "./components/dashboard/admin/meals/AddMealPage";
import MealsList from "./pages/MealsListing/Listing";
import MealDetails from "./pages/MealsListing/MealDetails";

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
              // <RedirectAuthenticatedUser>
                <Login />
              // </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/profile"
            element={
              // <ProtectedRoute>
                <Profile />
              // </ProtectedRoute>
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
          <Route path="/goals" element={<UserProfileForm />} />
          <Route path="/create-meal" element={<MealCreationPage />} />
          <Route path="/planner/:date" element={<MealPlanner />} />
          <Route path="/meals" element={<MealsList />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          <Route path="*" element={<PageNotFound />} />

          {/* Admin protected routes  */}
        
          <Route
            path="/admin"
            element={
              // <AdminProtectedRoute>
                <AdminLayout />
              // </AdminProtectedRoute>
            }
          >
            <Route
              path="users"
              element={
                // <AdminProtectedRoute>
                  <UserManagement />
                //  </AdminProtectedRoute>
              }
            />
            <Route
              path="meals"
              element={
                // <AdminProtectedRoute>
                  <MealsManagement />
                //  </AdminProtectedRoute>
              }
            />
             <Route
              path="meals/add"
              element={
                // <AdminProtectedRoute>
                  <AddMealPage />
                //  </AdminProtectedRoute>
              }
            />
               <Route
              path="meals/edit"
              element={
                // <AdminProtectedRoute>
                  <AddMealPage />
                //  </AdminProtectedRoute>
              }
            />
          </Route>
          

        </Routes>
      </div>
  </>
  );
}

export default App;
