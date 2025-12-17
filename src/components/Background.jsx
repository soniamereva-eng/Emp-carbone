export default function Background({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-textDark">
      
      {/* Forme pêche haut gauche */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-peach rounded-full opacity-90" />

      {/* Grand arc vert */}
      <div className="absolute top-40 -left-20 w-[900px] h-[600px] bg-primary rounded-full opacity-95" />

      {/* Rond vert clair droite */}
      <div className="absolute top-20 -right-40 w-[500px] h-[500px] bg-primaryLight rounded-full opacity-90" />

      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
