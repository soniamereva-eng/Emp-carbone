import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

const ADMINS = [
  "admin@entreprise.com",
  "direction@entreprise.com",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const COMMON_PASSWORD = import.meta.env.VITE_COMMON_PASSWORD;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Mot de passe commun
    if (password !== COMMON_PASSWORD) {
      setError("Mot de passe incorrect");
      return;
    }

    // ✅ Vérification email simple
    if (!email.includes("@")) {
      setError("Email invalide");
      return;
    }

    // ✅ Auth Supabase (email only)
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError("Erreur Supabase");
      return;
    }

    const isAdmin = ADMINS.includes(email);

    navigate(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-6 rounded-xl w-80"
      >
        <h1 className="text-xl mb-4 text-center">Connexion</h1>

        <input
          type="email"
          placeholder="Email professionnel"
          className="w-full p-2 mb-3 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe commun"
          className="w-full p-2 mb-3 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button className="w-full bg-green-600 p-2 rounded">
          Se connecter
        </button>
      </form>
    </div>
  );
}
