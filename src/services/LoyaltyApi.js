import { supabase } from "./supabaseClient";

// GET loyalty point history by customerId (UUID)
export async function getPointHistory(customerId) {
    try {
        const { data, error } = await supabase
            .from("loyalty_transactions")
            .select("*")
            .eq("customerId", customerId)
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in getPointHistory (${customerId}):`, error.message);
        throw error;
    }
}

// ADD points: inserts record to loyalty_transactions and increments customers.points
export async function addPoint(data) {
    try {
        // 1. Log transaction in loyalty_transactions
        const { data: txResult, error: txError } = await supabase
            .from("loyalty_transactions")
            .insert([{
                customerId: data.customerId,
                transactionId: data.transactionId || null,
                points: data.points,
                type: "Tambah",
                description: data.description || "Penambahan Poin"
            }])
            .select();

        if (txError) throw txError;

        // 2. Fetch current points of customer
        const { data: customer, error: fetchError } = await supabase
            .from("customers")
            .select("points")
            .eq("id", data.customerId)
            .single();

        if (fetchError) throw fetchError;

        // 3. Update customer points
        const newPoints = (customer.points || 0) + data.points;
        const { error: updateError } = await supabase
            .from("customers")
            .update({ 
                points: newPoints, 
                updatedAt: new Date().toISOString() 
            })
            .eq("id", data.customerId);

        if (updateError) throw updateError;

        return txResult?.[0] ?? null;
    } catch (error) {
        console.error("Error in addPoint:", error.message);
        throw error;
    }
}

// REDEEM points: inserts record to loyalty_transactions and decrements customers.points
export async function redeemPoint(data) {
    try {
        // 1. Log transaction in loyalty_transactions
        const { data: txResult, error: txError } = await supabase
            .from("loyalty_transactions")
            .insert([{
                customerId: data.customerId,
                transactionId: data.transactionId || null,
                points: data.points,
                type: "Tukar",
                description: data.description || "Penukaran Poin"
            }])
            .select();

        if (txError) throw txError;

        // 2. Fetch current points of customer
        const { data: customer, error: fetchError } = await supabase
            .from("customers")
            .select("points")
            .eq("id", data.customerId)
            .single();

        if (fetchError) throw fetchError;

        // 3. Update customer points (decrement points)
        const newPoints = (customer.points || 0) - data.points;
        const { error: updateError } = await supabase
            .from("customers")
            .update({ 
                points: newPoints, 
                updatedAt: new Date().toISOString() 
            })
            .eq("id", data.customerId);

        if (updateError) throw updateError;

        return txResult?.[0] ?? null;
    } catch (error) {
        console.error("Error in redeemPoint:", error.message);
        throw error;
    }
}
