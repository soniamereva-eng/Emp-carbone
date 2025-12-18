import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";

import BackgroundShapes from "./components/BackgroundShapes";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      {/* Fond animé */}
      <BackgroundShapes />

      {/* Logo / Header */}
      <Header />

      {/* Routes */}
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
