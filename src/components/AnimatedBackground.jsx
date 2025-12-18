export default function AnimatedBackground({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F3F6F4] to-[#E6ECE9]">
      {/* Cercles */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-green-300/30 rounded-full blur-3xl animate-slowFloat" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl animate-slowFloatDelay" />
      <div className="absolute top-[40%] left-[-200px] w-[350px] h-[350px] bg-lime-200/20 rounded-full blur-3xl animate-slowFloatReverse" />

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
