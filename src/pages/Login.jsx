import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    // 🔐 ADMIN
    if (
      firstname === "aeh" &&
      lastname === "admin" &&
      password === "Avenirenheritage17"
    ) {
      localStorage.setItem("empAuth", "true");
      localStorage.setItem("empAdmin", "true");
      localStorage.setItem("firstname", firstname);
      localStorage.setItem("lastname", lastname);

      navigate("/admin");
      return;
    }

    // 👤 USER
    if (password === "emp2025" && firstname && lastname) {
      localStorage.setItem("empAuth", "true");
      localStorage.removeItem("empAdmin");
      localStorage.setItem("firstname", firstname);
      localStorage.setItem("lastname", lastname);

      navigate("/dashboard");
      return;
    }

    setError("Identifiants incorrects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-background/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Connexion EMP Carbone
        </h1>

        <input
          type="text"
          placeholder="Prenom"
          className="w-full mb-3 p-3 rounded-xl border"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nom"
          className="w-full mb-3 p-3 rounded-xl border"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-4 p-3 rounded-xl border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
        >
          Se connecter
        </button>

        <p className="mt-4 text-xs text-gray-600 text-center italic">
          Les resultats presentes sont des estimations basees sur des moyennes
          issues de l ADEME, de simulateurs grand public et de projets scolaires.
        </p>
      </div>
    </div>
  );
}
