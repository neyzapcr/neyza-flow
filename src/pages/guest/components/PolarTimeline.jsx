import ScrollReveal from "./ScrollReveal";

export default function PolarTimeline({ steps, activeStep, setActiveStep }) {
  // Polar coordinate placement on a circle path (9 nodes distributed over 360 degrees)
  const getPosition = (idx) => {
    const angle = (idx * 360) / 9 - 90; // Start at 12 o'clock (-90 degrees)
    const rad = (angle * Math.PI) / 180;
    // Keep radius around 42% of parent container to fit nodes inside border
    const x = Math.cos(rad) * 42;
    const y = Math.sin(rad) * 42;
    return {
      left: `calc(50% + ${x}%)`,
      top: `calc(50% + ${y}%)`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <ScrollReveal variant="slide-right" className="flex-shrink-0">
      <div className="relative w-36 h-36 xs:w-44 xs:h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center">
        
        {/* Spinning Dashed Circle Outer Ring */}
        <div className="absolute inset-0 rounded-full border-[2px] sm:border-[3px] border-dashed border-white/30 animate-[spin_35s_linear_infinite]" />
        
        {/* Spinning Dashed SVG Ring */}
        <svg className="absolute inset-0 w-full h-full animate-[spin_50s_linear_infinite]" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            strokeDasharray="6,4" 
            opacity="0.4"
          />
        </svg>

        {/* Inner Glassmorphic Bubble Ring */}
        <div className="w-[84px] h-[84px] xs:w-[110px] xs:h-[110px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px] rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-2xl relative z-10 transition-all duration-300">
          
          {/* Dynamic Inner Icon Display */}
          <div className="w-8 h-8 xs:w-11 xs:h-11 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full bg-white text-[#3957ED] flex items-center justify-center shadow-lg transition-transform duration-350 transform scale-110">
            {(() => {
              const CurrentIcon = steps[activeStep].icon;
              return <CurrentIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 animate-[spin_8s_linear_infinite]" />;
            })()}
          </div>
          
          {/* Dynamic Step indicator */}
          <span className="text-[5px] xs:text-[6.5px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest text-sky-100 mt-1 sm:mt-3 font-mono">
            Langkah 0{steps[activeStep].stepNum}
          </span>
        </div>

        {/* Step Nodes positioned around the circle */}
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isSelected = activeStep === idx;
          const position = getPosition(idx);

          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`absolute z-20 w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border bg-white flex items-center justify-center shadow-xl transition-all duration-300 focus:outline-none cursor-pointer ${
                isSelected 
                  ? "border-amber-400 scale-115 ring-2 sm:ring-4 ring-white/35 text-[#3957ED]" 
                  : "border-white/50 text-gray-700 hover:scale-105"
              }`}
              style={position}
              aria-label={step.title}
            >
              <StepIcon className={`w-[9px] h-[9px] xs:w-[12px] xs:h-[12px] sm:w-[15px] sm:h-[15px] md:w-[17px] md:h-[17px] ${isSelected ? "animate-[spin_4s_linear_infinite]" : ""}`} />
              
              {/* Outer Step Number tag */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 xs:w-3.5 xs:h-3.5 rounded-full bg-[#3957ED] text-white text-[5px] xs:text-[6.5px] font-black flex items-center justify-center shadow">
                0{step.stepNum}
              </span>
            </button>
          );
        })}

      </div>
    </ScrollReveal>
  );
}
