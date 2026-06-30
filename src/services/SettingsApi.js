import { supabase } from "./supabaseClient";

/**
 * Ambil satu baris settings dari Supabase.
 * Mengembalikan object dengan field yang sama persis dengan kolom tabel settings.
 * Return null jika belum ada data.
 */
export async function getSettings() {
    try {
        const { data, error } = await supabase
            .from("settings")
            .select("*")
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return data ?? null;
    } catch (error) {
        console.error("getSettings error:", error.message);
        throw error;
    }
}

/**
 * Simpan atau update satu baris settings.
 * Selalu UPDATE baris yang sudah ada (berdasarkan id).
 * Jika belum ada baris sama sekali, lakukan INSERT satu kali.
 *
 * @param {object} payload — field langsung sesuai kolom tabel settings
 */
export async function updateSettings(payload) {
    try {
        // Ambil id baris yang sudah ada
        const { data: existing, error: fetchError } = await supabase
            .from("settings")
            .select("id")
            .limit(1)
            .maybeSingle();

        if (fetchError) throw fetchError;

        const now = new Date().toISOString();

        if (existing?.id) {
            // UPDATE baris yang ada — tidak pernah INSERT baru
            const { data, error } = await supabase
                .from("settings")
                .update({ ...payload, updatedAt: now })
                .eq("id", existing.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            // Baris belum ada sama sekali — INSERT sekali saja
            const { data, error } = await supabase
                .from("settings")
                .insert([{ ...payload, createdAt: now, updatedAt: now }])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error("updateSettings error:", error.message);
        throw error;
    }
}
