import { supabase } from "./supabaseClient";

// GET tracking info by transactionId (UUID)
export async function getTracking(transactionId) {
    try {
        const { data, error } = await supabase
            .from("tracking")
            .select("*")
            .eq("transactionId", transactionId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in getTracking (${transactionId}):`, error.message);
        throw error;
    }
}

// UPDATE tracking status and automatically log to tracking_history
export async function updateTracking(transactionId, status, updatedBy) {
    try {
        // 1. Update tracking table
        const { data: trackingRecord, error: trackingError } = await supabase
            .from("tracking")
            .upsert(
                { 
                    transactionId, 
                    currentStatus: status, 
                    updatedBy,
                    updatedAt: new Date().toISOString() 
                }, 
                { onConflict: "transactionId" }
            )
            .select()
            .single();

        if (trackingError) throw trackingError;

        // 2. Automatically insert history record to tracking_history
        const { error: historyError } = await supabase
            .from("tracking_history")
            .insert([
                {
                    trackingId: trackingRecord.id,
                    step: status,
                    status: true,
                    description: `Status laundry diperbarui menjadi ${status}`,
                    updatedBy,
                    time: new Date().toISOString()
                }
            ]);

        if (historyError) throw historyError;

        return trackingRecord;
    } catch (error) {
        console.error(`Error in updateTracking (${transactionId}, ${status}):`, error.message);
        throw error;
    }
}

// ADD tracking history record manually
export async function addTrackingHistory(data) {
    try {
        const { data: result, error } = await supabase
            .from("tracking_history")
            .insert([data])
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error("Error in addTrackingHistory:", error.message);
        throw error;
    }
}

// GET tracking history sorted from oldest to newest
export async function getTrackingHistory(transactionId) {
    try {
        // Get tracking record id first
        const { data: trackingRecord, error: trackingError } = await supabase
            .from("tracking")
            .select("id")
            .eq("transactionId", transactionId)
            .single();

        if (trackingError) {
            return [];
        }

        // Fetch history records ordered by time (ascending - oldest first)
        const { data, error } = await supabase
            .from("tracking_history")
            .select("*")
            .eq("trackingId", trackingRecord.id)
            .order("time", { ascending: true });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in getTrackingHistory (${transactionId}):`, error.message);
        throw error;
    }
}
