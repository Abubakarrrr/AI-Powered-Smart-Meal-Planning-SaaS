import { Route, Routes } from "react-router-dom";
import Signup from "Forms/Signup";

import "./index.css";
import Login from "Forms/Login";
function App() {
  return (
    <>
      <div className="font-primary">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
