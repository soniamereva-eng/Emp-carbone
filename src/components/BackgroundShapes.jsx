export default function BackgroundShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#F4F6F6]">

      {/* Forme principale */}
      <div
        className="absolute w-[1200px] h-[1200px] rounded-full"
        style={{
          background: "#6B9A9A",
          top: "-500px",
          left: "-300px",
        }}
      />

      {/* Forme beige */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "#F6C98B",
          top: "-400px",
          right: "-400px",
        }}
      />

      {/* Forme vert clair */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "#A9CFCF",
          bottom: "-300px",
          right: "-200px",
        }}
      />

      {/* Forme orange */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "#F2996E",
          bottom: "-350px",
          left: "-250px",
        }}
      />
    </div>
  );
}
