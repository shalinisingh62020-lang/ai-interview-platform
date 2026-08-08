
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Questions from "./pages/Questions";
import Results from "./pages/Results";
import Resume from "./pages/Resume";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/questions" element={<Questions />} />

      <Route path="/results" element={<Results />} />

      <Route path="/resume" element={<Resume />} />

    </Routes>
  );
}

export default App;
