import { useNavigate } from "react-router-dom";
import { useState } from "react";

const COMMON_PASSWORD = "emp2025";
const ADMIN_EMAIL = "admin@emp.fr";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!email) {
      setError("Adresse email obligatoire");
      return;
    }

    if (password !== COMMON_PASSWORD) {
      setError("Mot de passe incorrect");
      return;
    }

    localStorage.setItem("userEmail", email);

    if (email === ADMIN_EMAIL) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-background/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-primaryLight">
        
        <h1 className="text-4xl font-bold text-primary text-center mb-2">
          Empreinte Carbone
        </h1>
        <p className="text-center text-sm text-textDark/70 mb-8">
          Mesurer l’impact numérique
        </p>

        <input
          type="email"
          placeholder="Adresse email"
          className="w-full bg-white/60 border border-primaryLight p-3 rounded-xl mb-4 focus:ring-2 focus:ring-primary outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full bg-white/60 border border-primaryLight p-3 rounded-xl mb-6 focus:ring-2 focus:ring-primary outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary/90 transition"
        >
          Se connecter
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
