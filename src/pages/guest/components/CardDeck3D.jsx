import ScrollReveal from "./ScrollReveal";

export default function CardDeck3D({ steps, activeStep, isMobile }) {
  return (
    <ScrollReveal variant="slide-left" className="flex-shrink-0">
      <div className="relative w-[150px] h-[130px] xs:w-[185px] xs:h-[155px] sm:w-[240px] sm:h-[200px] md:w-[320px] md:h-[230px] flex items-center justify-center">
        
        {steps.map((step, idx) => {
          const diff = (idx - activeStep + 9) % 9;
          const StepIcon = step.icon;

          let transformStyle = "";
          let zIndex = 0;
          let opacity = 0;
          let pointerEvents = "none";

          if (isMobile) {
            // Scaled transforms for small viewports to prevent cards going off-screen
            if (diff === 0) {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(20px) translateX(0px) translateY(0px)";
              zIndex = 30;
              opacity = 1;
              pointerEvents = "auto";
            } else if (diff === 1) {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(8px) translateX(25px) translateY(-10px)";
              zIndex = 20;
              opacity = 0.75;
              pointerEvents = "auto";
            } else if (diff === 2) {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-5px) translateX(50px) translateY(-20px)";
              zIndex = 10;
              opacity = 0.45;
              pointerEvents = "auto";
            } else if (diff === 8) {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(40px) translateX(-20px) translateY(90px)";
              zIndex = 40;
              opacity = 0;
            } else if (diff === 3) {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-25px) translateX(70px) translateY(-70px)";
              zIndex = 5;
              opacity = 0;
            } else {
              transformStyle = "perspective(800px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-50px) translateX(90px) translateY(-90px)";
              zIndex = 0;
              opacity = 0;
            }
          } else {
            // Desktop Transforms
            if (diff === 0) {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(40px) translateX(0px) translateY(0px)";
              zIndex = 30;
              opacity = 1;
              pointerEvents = "auto";
            } else if (diff === 1) {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(15px) translateX(45px) translateY(-18px)";
              zIndex = 20;
              opacity = 0.75;
              pointerEvents = "auto";
            } else if (diff === 2) {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-10px) translateX(90px) translateY(-36px)";
              zIndex = 10;
              opacity = 0.45;
              pointerEvents = "auto";
            } else if (diff === 8) {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(80px) translateX(-40px) translateY(180px)";
              zIndex = 40;
              opacity = 0;
            } else if (diff === 3) {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-45px) translateX(130px) translateY(-120px)";
              zIndex = 5;
              opacity = 0;
            } else {
              transformStyle = "perspective(1200px) rotateX(15deg) rotateY(-20deg) rotateZ(3deg) translateZ(-80px) translateX(160px) translateY(-180px)";
              zIndex = 0;
              opacity = 0;
            }
          }

          return (
            <div
              key={idx}
              className="absolute"
              style={{
                transform: transformStyle,
                zIndex: zIndex,
                opacity: opacity,
                pointerEvents: pointerEvents,
                transformStyle: "preserve-3d",
                transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Card Element - Clean White Card scaled responsively */}
              <div 
                className="w-[130px] h-[105px] xs:w-[160px] xs:h-[125px] sm:w-[210px] sm:h-[160px] md:w-[285px] md:h-[180px] rounded-xl xs:rounded-2xl sm:rounded-3xl relative p-2 sm:p-4.5 md:p-5 shadow-2xl text-gray-800 flex flex-col justify-between overflow-hidden border border-gray-100 bg-white"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Top Row: Icon & Step Number */}
                <div className="flex justify-between items-center">
                  <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-[#3957ED] flex items-center justify-center">
                    <StepIcon className="w-2.5 h-2.5 xs:w-3.5 xs:h-3.5" />
                  </div>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-black tracking-widest text-[#3957ED] font-mono">
                    LANGKAH 0{step.stepNum}
                  </span>
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 sm:space-y-1 text-left">
                  <h4 className="text-[8px] xs:text-[9.5px] sm:text-[11px] md:text-xs font-black text-gray-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-bold text-gray-500 leading-normal line-clamp-3">
                    {step.description}
                  </p>
                </div>

                {/* Bottom: Info indicator */}
                <div className="border-t border-gray-100 pt-1 xs:pt-1.5 sm:pt-2 flex justify-between items-center text-[5.5px] xs:text-[6.5px] sm:text-[7.5px] font-extrabold text-gray-400 uppercase tracking-widest">
                  <span>Detail Alur</span>
                  <span className="text-[#3957ED] font-mono">Netto Laundry</span>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </ScrollReveal>
  );
}
