import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import DidYouKnow from "../components/DidYouKnow";

export default function Admin() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("empAdmin");
    if (!isAdmin) navigate("/");
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data } = await supabase
      .from("carbon_history")
      .select("*")
      .order("created_at", { ascending: false });

    setRecords(data || []);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const total = records
    .filter((r) => selectedIds.includes(r.id))
    .reduce((sum, r) => sum + Number(r.result), 0)
    .toFixed(2);

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(18);
    pdf.text("Bilan EMP Carbone - Admin", 105, 20, { align: "center" });

    let y = 40;
    pdf.setFontSize(10);
    pdf.text("Prenom", 10, y);
    pdf.text("Nom", 40, y);
    pdf.text("Resultat", 80, y);
    pdf.text("IA", 120, y);
    pdf.text("Date", 160, y);

    y += 5;
    pdf.line(10, y, 200, y);
    y += 5;

    records
      .filter((r) => selectedIds.includes(r.id))
      .forEach((item) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(item.firstname, 10, y);
        pdf.text(item.lastname, 40, y);
        pdf.text(String(item.result), 80, y);
        pdf.text(String(item.ai_minutes), 120, y);
        pdf.text(
          new Date(item.created_at).toLocaleDateString(),
          160,
          y
        );

        y += 8;
      });

    y += 10;
    pdf.setFontSize(12);
    pdf.text(`Total selection : ${total} kg CO2`, 10, y);

    pdf.addPage();
    pdf.setFontSize(10);
    const info =
      "Les resultats presentes sont des estimations basees sur des moyennes issues de l ADEME, de simulateurs grand public et de projets scolaires.";
    pdf.text(pdf.splitTextToSize(info, 180), 10, 20);

    pdf.save("bilan_admin_emp_carbone.pdf");
  };

  return (
    <div className="p-10">
      <div className="max-w-6xl mx-auto bg-background/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <Logo />
          <button
            onClick={() => navigate("/logout")}
            className="bg-peach text-white px-4 py-2 rounded-xl"
          >
            Se deconnecter
          </button>
        </div>

        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th></th>
              <th>Prenom</th>
              <th>Nom</th>
              <th>Resultat</th>
              <th>IA</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td>
                  <input
                    type="checkbox"
                    onChange={() => toggleSelect(r.id)}
                  />
                </td>
                <td>{r.firstname}</td>
                <td>{r.lastname}</td>
                <td>{r.result}</td>
                <td>{r.ai_minutes}</td>
                <td>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between items-center">
          <p className="font-semibold">Total : {total} kg CO2</p>
          <button
            onClick={downloadPDF}
            className="bg-primary text-white px-6 py-3 rounded-xl"
          >
            Telecharger le PDF
          </button>
        </div>

        <DidYouKnow />
      </div>
    </div>
  );
}
