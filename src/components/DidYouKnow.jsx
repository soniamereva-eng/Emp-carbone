export default function DidYouKnow() {
  return (
    <div className="mt-8 bg-white/60 backdrop-blur-md border border-green-200 rounded-2xl p-5">
      <h3 className="font-semibold text-green-800 mb-2">
        Le saviez-vous ?
      </h3>

      <p className="text-sm text-gray-700 leading-relaxed">
        Il est possible de calculer son empreinte carbone numerique
        en prenant en compte trois postes principaux : la fabrication
        des outils numeriques, leur consommation electrique et les
        reseaux internet incluant les services informatiques.
      </p>

      <p className="mt-3 text-xs text-gray-600 italic">
        Les resultats presentes sont des estimations basees sur des
        moyennes issues de l ADEME ainsi que des données compilées par TaCa et Avenir climatique.
      </p>
    </div>
  );
}
