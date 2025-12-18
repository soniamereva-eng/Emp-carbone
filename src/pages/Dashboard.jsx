import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import DidYouKnow from "../components/DidYouKnow";

export default function Dashboard() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [computerHours, setComputerHours] = useState(0);
  const [mobileHours, setMobileHours] = useState(0);
  const [aiMinutes, setAiMinutes] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const isAuth = localStorage.getItem("empAuth");
    const fn = localStorage.getItem("firstname");
    const ln = localStorage.getItem("lastname");

    if (!isAuth || !fn || !ln) {
      navigate("/");
      return;
    }

    setFirstname(fn);
    setLastname(ln);
    fetchHistory(fn, ln);
  }, []);

  const calculate = () => {
    const footprint =
      computerHours * 0.05 +
      mobileHours * 0.02 +
      aiMinutes * 0.01;

    setResult(footprint.toFixed(2));
  };

  const saveResult = async () => {
    const { error } = await supabase.from("carbon_history").insert([
      {
        firstname,
        lastname,
        computer_hours: computerHours,
        mobile_hours: mobileHours,
        ai_minutes: aiMinutes,
        result,
      },
    ]);

    if (error) {
      alert("Erreur lors de l'enregistrement");
      return;
    }

    fetchHistory(firstname, lastname);
    setResult(null);
  };

  const fetchHistory = async (fn, ln) => {
    const { data } = await supabase
      .from("carbon_history")
      .select("*")
      .eq("firstname", fn)
      .eq("lastname", ln)
      .order("created_at", { ascending: false });

    setHistory(data || []);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(18);
    pdf.text("Historique EMP Carbone", 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(`${firstname} ${lastname}`, 105, 30, { align: "center" });

    let y = 45;
    pdf.setFontSize(10);
    pdf.text("Resultat (kg CO2)", 10, y);
    pdf.text("IA (min)", 60, y);
    pdf.text("Date", 110, y);

    y += 5;
    pdf.line(10, y, 200, y);
    y += 5;

    history.forEach((item) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(String(item.result), 10, y);
      pdf.text(String(item.ai_minutes), 60, y);
      pdf.text(new Date(item.created_at).toLocaleDateString(), 110, y);

      y += 8;
    });

    pdf.addPage();
    pdf.setFontSize(10);
    const info =
      "Les resultats presentes sont des estimations basees sur des moyennes issues de l ADEME, de simulateurs grand public et de projets scolaires.";
    pdf.text(pdf.splitTextToSize(info, 180), 10, 20);

    pdf.save("historique_emp_carbone.pdf");
  };

  return (
    <div className="p-10">
      <div className="max-w-3xl mx-auto bg-background/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
        <Logo />

        <p className="text-sm text-gray-600">
          {firstname} {lastname}
        </p>

        <button
          onClick={() => navigate("/logout")}
          className="mb-6 bg-peach text-white px-4 py-2 rounded-xl"
        >
          Se deconnecter
        </button>

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Heures ordinateur"
            className="p-3 rounded-xl border"
            onChange={(e) => setComputerHours(+e.target.value)}
          />
          <input
            type="number"
            placeholder="Heures mobile"
            className="p-3 rounded-xl border"
            onChange={(e) => setMobileHours(+e.target.value)}
          />
          <input
            type="number"
            placeholder="IA (minutes)"
            className="p-3 rounded-xl border"
            onChange={(e) => setAiMinutes(+e.target.value)}
          />
        </div>

        <button
          onClick={calculate}
          className="mt-4 w-full bg-primary text-white py-3 rounded-xl"
        >
          Calculer
        </button>

        {result && (
          <div className="mt-6 bg-primaryLight/60 rounded-2xl p-5">
            <p className="text-xl font-semibold">
              Empreinte carbone : {result} kg CO2
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
            <li key={item.id} className="bg-white/60 p-3 rounded-xl">
              {item.result} kg CO2 —{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </li>
          ))}
        </ul>

        {history.length > 0 && (
          <button
            onClick={downloadPDF}
            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-xl"
          >
            Telecharger le PDF
          </button>
        )}

        <DidYouKnow />
      </div>
    </div>
  );
}
