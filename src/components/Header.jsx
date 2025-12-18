import logo from "../assets/logo.jpg";

export default function Header() {
  return (
    <header className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
      <img
        src={logo}
        alt="EMP Carbone"
        className="w-12 h-12 object-contain rounded-xl"
      />
      <span className="font-bold text-primary text-lg">
        AEH
      </span>
    </header>
  );
}
