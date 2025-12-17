export default function TwButton({ children }) {
  return (
    <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800">
      {children}
    </button>
  );
}
