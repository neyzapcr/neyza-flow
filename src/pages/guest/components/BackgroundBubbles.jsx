import { useMemo } from "react";

export default function BackgroundBubbles({ count = 10, theme = "light" }) {
  // Pre-defined static array of bubble properties to prevent hydration mismatch
  const bubbleStyles = useMemo(() => [
    // Gentle Swaying Bubbles (stay in fixed spots and drift)
    { id: 1, type: "sway", left: "10%", top: "15%", size: "w-16 h-16 sm:w-24 sm:h-24", anim: "animate-sway-1", delay: "0s", speed: "12s" },
    { id: 2, type: "sway", left: "85%", top: "20%", size: "w-20 h-20 sm:w-28 sm:h-28", anim: "animate-sway-2", delay: "1s", speed: "14s" },
    { id: 3, type: "sway", left: "75%", top: "65%", size: "w-12 h-12 sm:w-16 sm:h-16", anim: "animate-sway-3", delay: "2s", speed: "10s" },
    { id: 4, type: "sway", left: "5%", top: "70%", size: "w-20 h-20 sm:w-24 sm:h-24", anim: "animate-sway-4", delay: "0.5s", speed: "16s" },
    { id: 5, type: "sway", left: "45%", top: "40%", size: "w-8 h-8 sm:w-12 sm:h-12", anim: "animate-sway-1", delay: "3s", speed: "9s" },
    { id: 6, type: "sway", left: "90%", top: "80%", size: "w-16 h-16 sm:w-20 sm:h-20", anim: "animate-sway-3", delay: "1.5s", speed: "11s" },
    { id: 7, type: "sway", left: "25%", top: "85%", size: "w-10 h-10 sm:w-14 sm:h-14", anim: "animate-sway-2", delay: "4s", speed: "13s" },
    
    // Rising Bubbles (float up from bottom to top)
    { id: 8, type: "rise", left: "15%", top: "auto", size: "w-6 h-6 sm:w-8 sm:h-8", anim: "animate-rise-slow", delay: "0.2s", speed: "18s" },
    { id: 9, type: "rise", left: "35%", top: "auto", size: "w-8 h-8 sm:w-10 sm:h-10", anim: "animate-rise-med", delay: "3s", speed: "14s" },
    { id: 10, type: "rise", left: "55%", top: "auto", size: "w-5 h-5 sm:w-6 sm:h-6", anim: "animate-rise-slow", delay: "1.5s", speed: "16s" },
    { id: 11, type: "rise", left: "70%", top: "auto", size: "w-10 h-10 sm:w-12 sm:h-12", anim: "animate-rise-med", delay: "5s", speed: "13s" },
    { id: 12, type: "rise", left: "80%", top: "auto", size: "w-7 h-7 sm:w-8 sm:h-8", anim: "animate-rise-slow", delay: "2.5s", speed: "17s" },
    { id: 13, type: "rise", left: "22%", top: "auto", size: "w-8 h-8 sm:w-10 sm:h-10", anim: "animate-rise-med", delay: "4.5s", speed: "15s" },
    { id: 14, type: "rise", left: "62%", top: "auto", size: "w-6 h-6 sm:w-7 sm:h-7", anim: "animate-rise-slow", delay: "6s", speed: "19s" },
    { id: 15, type: "rise", left: "48%", top: "auto", size: "w-10 h-10 sm:w-14 sm:h-14", anim: "animate-rise-med", delay: "0.8s", speed: "12s" },
  ], []);

  // Limit rendering to requested count (max 15)
  const renderedBubbles = useMemo(() => bubbleStyles.slice(0, count), [count, bubbleStyles]);

  // Color theme logic
  const themeClasses = theme === "light"
    ? "border-white/20 bg-radial-[at_30%_30%] from-white/18 to-white/3 shadow-[inset_-2px_-2px_6px_rgba(255,255,255,0.1),inset_2px_2px_6px_rgba(255,255,255,0.25),0_4px_10px_rgba(255,255,255,0.05)] after:bg-white/45"
    : "border-blue-500/15 bg-radial-[at_30%_30%] from-blue-200/25 to-blue-500/3 shadow-[inset_-2px_-2px_6px_rgba(57,87,237,0.08),inset_2px_2px_6px_rgba(128,200,246,0.18),0_4px_12px_rgba(57,87,237,0.04)] after:bg-white/70";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <style>{`
        @keyframes b-sway-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(12px, -15px) scale(1.06); }
          66% { transform: translate(-8px, 8px) scale(0.96); }
        }
        @keyframes b-sway-2 {
          0%, 100% { transform: translate(0, 0) scale(1.04); }
          50% { transform: translate(-18px, -25px) scale(0.94); }
        }
        @keyframes b-sway-3 {
          0%, 100% { transform: translate(0, 0) scale(0.96); }
          50% { transform: translate(15px, 18px) scale(1.08); }
        }
        @keyframes b-sway-4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-12px, 15px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes b-rise-s {
          0% { transform: translateY(110%) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translateY(-20%) translateX(25px) scale(1.15); opacity: 0; }
        }
        @keyframes b-rise-m {
          0% { transform: translateY(110%) translateX(0) scale(0.7); opacity: 0; }
          15% { opacity: 0.45; }
          85% { opacity: 0.45; }
          100% { transform: translateY(-20%) translateX(-20px) scale(1.05); opacity: 0; }
        }
        
        .animate-sway-1 { animation: b-sway-1 linear infinite alternate; }
        .animate-sway-2 { animation: b-sway-2 linear infinite alternate; }
        .animate-sway-3 { animation: b-sway-3 linear infinite alternate; }
        .animate-sway-4 { animation: b-sway-4 linear infinite; }
        .animate-rise-slow { animation: b-rise-s linear infinite; }
        .animate-rise-med { animation: b-rise-m linear infinite; }
      `}</style>
      
      {renderedBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full border ${themeClasses} ${bubble.size} ${bubble.anim}
            after:content-[''] after:absolute after:top-[12%] after:left-[12%] after:w-[15%] after:h-[15%] after:rounded-full`}
          style={{
            left: bubble.left,
            top: bubble.top !== "auto" ? bubble.top : undefined,
            bottom: bubble.top === "auto" ? "-60px" : undefined,
            animationDelay: bubble.delay,
            animationDuration: bubble.speed,
            transition: "opacity 0.5s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
