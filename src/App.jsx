import { Routes, Route } from "react-router-dom";
import Admin from "./Admin.jsx";
import Login from "./Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
