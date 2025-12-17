import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import Background from "./components/Background";

export default function App() {
  return (
    <Background>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Background>
  );
}
