import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("empAuth");
    if (!isAuth) navigate("/");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
      })
      .select()
      .single();

    if (error) {
      alert("Erreur création utilisateur");
      console.error(error);
      return;
    }

    localStorage.setItem("userId", data.id);
    localStorage.setItem(
      "userName",
      `${data.first_name} ${data.last_name}`
    );

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Informations utilisateur
        </h2>

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
