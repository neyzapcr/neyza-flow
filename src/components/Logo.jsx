import React from "react";
import { Shirt, Wind, Sparkles, Package, Star, Medal, Zap, Users, ShieldCheck } from "lucide-react";

const ICON_MAP = {
  Shirt,
  Wind,
  Sparkles,
  Package,
  Star,
  Medal,
  Zap,
  Users,
  ShieldCheck
};

export default function Logo({ variant = "dark", className = "", expanded = true }) {
  const configStr = localStorage.getItem("netto_branding");
  const config = configStr ? JSON.parse(configStr) : {
    themePrimary: "#2940D3",
    themeSecondary: "#142297",
    logoType: "image",
    logoUrlDark: "/img/logo Netto Dark.png",
    logoUrlLight: "/img/logo Netto light.png",
    logoText: "Netto Laundry",
    logoIcon: "Shirt"
  };

  if (config.logoType === "image") {
    const src = variant === "light" ? config.logoUrlLight : config.logoUrlDark;
    return (
      <img
        src={src || "/img/logo Netto Dark.png"}
        alt={config.logoText || "Netto Laundry"}
        className={`object-contain transition-all duration-300 ${className}`}
      />
    );
  }

  // Text + Icon Logo
  const IconComponent = ICON_MAP[config.logoIcon] || Shirt;
  const textColor = variant === "light" ? "text-white" : "text-gray-800";
  const iconColor = variant === "light" ? "text-white/90" : "text-[#2940D3]";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center ${variant === "light" ? "bg-white/10" : "bg-[#2940D3]/10"}`}>
        <IconComponent size={20} className={iconColor} />
      </div>
      {expanded && (
        <span className={`font-Montserrat font-extrabold text-sm xl:text-base tracking-tight leading-none ${textColor}`}>
          {config.logoText || "Netto Laundry"}
        </span>
      )}
    </div>
  );
}
