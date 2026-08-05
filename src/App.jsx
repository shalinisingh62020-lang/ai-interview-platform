import Questions from "./pages/Questions";
import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Signup from "./pages/Signup";
import Results from "./pages/Results";
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

        <Route path="/questions" element={<Questions />} />

        <Route path="/results" element={<Results />} />

      </Routes>
      </>
  );
}

export default App;