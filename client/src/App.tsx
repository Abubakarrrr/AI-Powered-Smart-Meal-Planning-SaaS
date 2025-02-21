import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "@/pages/Home";
import {Login,Signup,Profile,EmailVerify} from "@/Forms"

import { Toaster } from "@/components/ui/toaster";
function App() {
  return (
    <>
      <div className="font-primary">
        <Toaster/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/email-verify" element={<EmailVerify />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
