import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [session, setSession] = useState(null);
  const [hours, setHours] = useState("");
  const [co2, setCo2] = useState(null);
  const [history, setHistory] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [dark, setDark] = useState(false);
  const [username, setUsername] = useState("");

  // load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // auth + history
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadHistory(data.session);
      loadProfile(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) loadHistory(newSession);
      loadProfile(newSession);
    });

    return () => {
      try { listener.subscription.unsubscribe(); } catch(e) {}
    };
  }, []);

  async function loadProfile(activeSession) {
    if (!activeSession?.user) return;
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", activeSession.user.id)
      .single();

    if (data?.username) setUsername(data.username);
  }

  async function saveProfile(name) {
    if (!session) return;
    await supabase.from("profiles").upsert({
      id: session.user.id,
      username: name,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
    setUsername(name);
  }

  async function loadHistory(activeSession) {
    if (!activeSession?.user) return;

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", activeSession.user.id)
      .order("session_start", { ascending: false });

    if (error) { console.error(error); return; }
    setHistory(data);

    const currentMonth = new Date().getMonth();
    const total = data
      .filter(s => new Date(s.session_start).getMonth() === currentMonth)
      .reduce((acc, s) => acc + s.co2_g / 1000, 0);
    setMonthlyTotal(total.toFixed(3));
  }

  async function signIn() {
    const email = prompt("Email :");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert("Erreur : " + error.message);
    else alert("Lien envoyé, ouvre ton email (même navigateur).");
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  function calculateCo2(hours) {
    return (hours * 0.055).toFixed(3);
  }

  async function submitHours() {
    if (!hours) return alert("Entre un nombre d’heures !");
    const value = calculateCo2(hours);

    const { error } = await supabase.from("sessions").insert({
      user_id: session.user.id,
      display_name: session.user.email,
      duration_seconds: Number(hours) * 3600,
      estimated_kwh: (Number(hours) * 0.05) / 1000,
      co2_g: Number(value) * 1000,
      session_start: new Date().toISOString(),
      session_end: new Date().toISOString()
    });

    if (error) { console.error(error); return alert("Erreur lors de l’enregistrement"); }

    setCo2(value);
    alert("Enregistré !");
    loadHistory(session);
  }

  // toggle theme
  function toggleDark() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#071025]">
        <div className="w-full max-w-md bg-white dark:bg-[#0f1724] shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Connexion requise</h2>
            <button onClick={toggleDark} className="text-sm px-2 py-1 border rounded">{dark ? '☀️' : '🌙'}</button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Connecte-toi avec ton email (magic link)</p>
          <button onClick={signIn} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Se connecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#071025] text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Empreinte Carbone</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Suivi de la consommation numérique</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm">{username || session.user.email}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{session.user.email}</div>
            </div>
            <button onClick={toggleDark} className="px-3 py-2 border rounded">{dark ? '☀️' : '🌙'}</button>
            <button onClick={signOut} className="px-3 py-2 bg-red-600 text-white rounded">Déconnexion</button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-[#0f1724] p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Saisir une session</h2>

            <label className="block text-sm mb-1">Pseudo (optionnel)</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Ton pseudo" className="flex-1 rounded border p-2 bg-gray-50 dark:bg-[#061328]" />
              <button onClick={()=>saveProfile(username)} className="px-3 py-2 bg-green-600 text-white rounded">Sauvegarder</button>
            </div>

            <label className="block text-sm mb-1">Heures aujourd’hui</label>
            <div className="flex gap-2">
              <input type="number" value={hours} onChange={(e)=>setHours(e.target.value)} placeholder="ex: 8" className="flex-1 rounded border p-2 bg-gray-50 dark:bg-[#061328]" />
              <button onClick={submitHours} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
            </div>

            {co2 && <p className="mt-3 text-sm">Empreinte estimée : <strong>{co2} kg</strong></p>}
          </section>

          <aside className="bg-white dark:bg-[#0f1724] p-4 rounded-lg shadow">
            <h3 className="font-semibold">Résumé</h3>
            <div className="mt-3">
              <div className="text-sm text-gray-500 dark:text-gray-400">CO₂ ce mois</div>
              <div className="text-2xl font-bold">{monthlyTotal} kg</div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium mb-2">Historique (récent)</h4>
              <div className="space-y-2 max-h-64 overflow-auto">
                {history.slice(0,8).map(h=>(
                  <div key={h.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-[#081526]">
                    <div>
                      <div className="text-sm">{new Date(h.session_start).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{(h.duration_seconds/3600).toFixed(1)} h</div>
                    </div>
                    <div className="font-mono text-sm">{(h.co2_g/1000).toFixed(3)} kg</div>
                  </div>
                ))}
                {history.length===0 && <div className="text-sm text-gray-500">Aucune session</div>}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
