import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import BackgroundShapes from "./components/BackgroundShapes";

export default function App() {
  return (
    <>
      <BackgroundShapes />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}
