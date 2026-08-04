import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Signup from "./pages/Signup";
function App() {
  return (
    <>
    <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/signup" element={<Signup />} />

      </Routes>
      </>
  );
}

export default App;