import { useState, useEffect } from "react";
import { getSettings } from "../services/SettingsApi";

// Fallback default — cocok dengan nilai hardcoded yang ada di komponen landing page
const FALLBACK = {
  laundryName: "Netto Express Laundry",
  phone: "6282122448899",
  email: "support@nettoexpresslaundry.com",
  address: "Jl. Kuau No.2A, Kp. Melayu, Sukajadi, Kota Pekanbaru, Riau 28122",
  openTime: "07:00",
  closeTime: "21:00",
  washOnlyPrice: 7000,
  washIronPrice: 8000,
  ironOnlyPrice: 5000,
  expressPrice: 12000,
  pointPerTransaction: 10,
  minimumRedeemPoint: 100,
  promoTitle: "",
  promoDescription: "",
  promoDiscount: 0,
  promoStatus: false,
};

/**
 * Hook untuk mengambil settings dari Supabase.
 * Bisa dipakai di komponen mana saja — landing page, admin, member, dll.
 *
 * @returns {{ settings: object, loading: boolean }}
 */
export function useSettings() {
  const [settings, setSettings] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((data) => {
        if (data) {
          setSettings({
            ...FALLBACK,
            ...data,
            // Pastikan boolean ter-cast dengan benar — Supabase kadang return string "true"/"false"
            promoStatus: data.promoStatus === true || data.promoStatus === "true" || data.promoStatus === 1,
            washOnlyPrice:  Number(data.washOnlyPrice  || FALLBACK.washOnlyPrice),
            washIronPrice:  Number(data.washIronPrice  || FALLBACK.washIronPrice),
            ironOnlyPrice:  Number(data.ironOnlyPrice  || FALLBACK.ironOnlyPrice),
            expressPrice:   Number(data.expressPrice   || FALLBACK.expressPrice),
            promoDiscount:  Number(data.promoDiscount  || 0),
            pointPerTransaction: Number(data.pointPerTransaction || FALLBACK.pointPerTransaction),
            minimumRedeemPoint:  Number(data.minimumRedeemPoint  || FALLBACK.minimumRedeemPoint),
          });
        }
      })
      .catch(() => {
        // Gagal fetch — tetap pakai FALLBACK, tidak crash
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
