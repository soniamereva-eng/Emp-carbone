import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [computerHours, setComputerHours] = useState(0);
  const [mobileHours, setMobileHours] = useState(0);
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      navigate("/");
      return;
    }
    setEmail(storedEmail);
    fetchHistory(storedEmail);
  }, []);

  const calculate = () => {
    const footprint =
      computerHours * 0.05 + mobileHours * 0.02;
    setResult(footprint.toFixed(2));
  };

  const saveResult = async () => {
    await supabase.from("carbon_history").insert([
      {
        email,
        computer_hours: computerHours,
        mobile_hours: mobileHours,
        result,
      },
    ]);
    fetchHistory(email);
  };

  const fetchHistory = async (userEmail) => {
    const { data } = await supabase
      .from("carbon_history")
      .select("*")
      .eq("email", userEmail)
      .order("created_at", { ascending: false });

    setHistory(data || []);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Historique empreinte carbone", 10, 10);
    history.forEach((item, i) => {
      pdf.text(`${i + 1}. ${item.result} kg CO₂`, 10, 20 + i * 10);
    });
    pdf.save("historique.pdf");
  };

  return (
    <div className="p-10">
      <div className="max-w-3xl mx-auto bg-background/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-primaryLight">

        <h1 className="text-3xl font-bold text-primary mb-1">
          Tableau de bord
        </h1>
        <p className="text-sm text-textDark/70 mb-6">{email}</p>

        <button
          onClick={() => navigate("/logout")}
          className="mb-6 bg-peach text-white px-4 py-2 rounded-xl"
        >
          Se déconnecter
        </button>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Heures ordinateur"
            className="p-3 rounded-xl border border-primaryLight"
            onChange={(e) => setComputerHours(+e.target.value)}
          />
          <input
            type="number"
            placeholder="Heures mobile"
            className="p-3 rounded-xl border border-primaryLight"
            onChange={(e) => setMobileHours(+e.target.value)}
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 w-full bg-primary text-white py-3 rounded-xl"
        >
          Calculer
        </button>

        {result > 0 && (
          <div className="mt-6 bg-primaryLight/60 rounded-2xl p-5">
            <p className="text-xl font-semibold">
              🌱 Empreinte carbone : {result} kg CO₂
            </p>

            <button
              onClick={saveResult}
              className="mt-4 bg-peach text-white px-6 py-2 rounded-xl"
            >
              Enregistrer
            </button>
          </div>
        )}

        <h2 className="mt-8 font-semibold">Historique</h2>

        <ul className="mt-2 space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="bg-white/60 p-3 rounded-xl"
            >
              {item.result} kg CO₂
            </li>
          ))}
        </ul>

        {history.length > 0 && (
          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl"
          >
            Télécharger le PDF
          </button>
        )}
      </div>
    </div>
  );
}
