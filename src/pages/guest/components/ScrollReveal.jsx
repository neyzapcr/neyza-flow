import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ 
  children, 
  variant = "slide-up", 
  delay = 0, 
  duration = 750,
  className = "" 
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Animate once, then stop observing
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05, // trigger when 5% of the element is visible
        rootMargin: "0px 0px -40px 0px" // offset trigger slightly
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getVariantStyles = () => {
    if (isIntersecting) {
      return "opacity-100 translate-x-0 translate-y-0 scale-100";
    }
    
    switch (variant) {
      case "fade":
        return "opacity-0";
      case "slide-up":
        return "opacity-0 translate-y-12";
      case "slide-down":
        return "opacity-0 -translate-y-12";
      case "slide-left":
        return "opacity-0 translate-x-12";
      case "slide-right":
        return "opacity-0 -translate-x-12";
      case "scale":
        return "opacity-0 scale-95 translate-y-6";
      default:
        return "opacity-0 translate-y-12";
    }
  };

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-all ease-out ${getVariantStyles()} ${className}`}
    >
      {children}
    </div>
  );
}
