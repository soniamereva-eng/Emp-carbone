import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userEmail") !== "admin@emp.fr") {
      navigate("/");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase
      .from("carbon_history")
      .select("*")
      .order("created_at", { ascending: false });
    setData(data || []);
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Rapport Administrateur", 10, 10);
    data.forEach((item, i) => {
      pdf.text(
        `${i + 1}. ${item.email} - ${item.result} kg CO₂`,
        10,
        20 + i * 10
      );
    });
    pdf.save("rapport-admin.pdf");
  };

  return (
    <div className="p-10">
      <div className="max-w-5xl mx-auto bg-background/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-primaryLight">

        <h1 className="text-4xl font-bold text-primary mb-6">
          Dashboard Administrateur
        </h1>

        <button
          onClick={exportPDF}
          className="mb-6 bg-primary text-white px-6 py-2 rounded-xl"
        >
          Exporter PDF
        </button>

        <table className="w-full border border-primaryLight rounded-xl overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3">Email</th>
              <th>Ordinateur</th>
              <th>Mobile</th>
              <th>CO₂</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="text-center bg-white/60">
                <td className="p-2">{row.email}</td>
                <td>{row.computer_hours}</td>
                <td>{row.mobile_hours}</td>
                <td>{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
