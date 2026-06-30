import { supabase } from "./supabaseClient";

// GET all notifications by customerId (UUID)
export async function getNotifications(customerId) {
    try {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("customerId", customerId)
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in getNotifications (${customerId}):`, error.message);
        throw error;
    }
}

// CREATE notification for a customer
export async function createNotification(data) {
    try {
        const { data: result, error } = await supabase
            .from("notifications")
            .insert([data])
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error("Error in createNotification:", error.message);
        throw error;
    }
}

// MARK notification as read (sets isRead to true and readAt to current timestamp)
export async function markAsRead(id) {
    try {
        const { data: result, error } = await supabase
            .from("notifications")
            .update({ 
                isRead: true, 
                readAt: new Date().toISOString() 
            })
            .eq("id", id)
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error(`Error in markAsRead (${id}):`, error.message);
        throw error;
    }
}

// DELETE notification by id
export async function deleteNotification(id) {
    try {
        const { data, error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in deleteNotification (${id}):`, error.message);
        throw error;
    }
}
