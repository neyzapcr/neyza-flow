import BackgroundBubbles from "./BackgroundBubbles";

export default function Partners() {
  const partners = [
    "ECO-DETERGENT",
    "AQUACLEAN CO.",
    "STEAMPRO INDO",
    "FRESHPARFUM",
    "NEO-CLEAN"
  ];

  return (
    <section className="bg-[#FAFBFD] py-10 relative overflow-hidden">
      <BackgroundBubbles count={6} theme="blue" />
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Mitra Suplier Detergen & Pengharum Kami
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:opacity-75 transition-opacity duration-300">
          {partners.map((partner, index) => (
            <span 
              key={index} 
              className="text-lg font-bold text-gray-500 font-mono hover:text-[#3957ED] transition-colors duration-200 cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
