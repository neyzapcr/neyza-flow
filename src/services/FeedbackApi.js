import { supabase } from "./supabaseClient";

// GET all feedback with customer details
export async function getFeedback() {
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*, customers(customerCode, customerName)")
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error in getFeedback:", error.message);
        throw error;
    }
}

// GET feedback by customerId (UUID)
export async function getFeedbackByCustomer(customerId) {
    try {
        const { data, error } = await supabase
            .from("feedback")
            .select("*, customers(customerCode, customerName)")
            .eq("customerId", customerId)
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error(`Error in getFeedbackByCustomer (${customerId}):`, error.message);
        throw error;
    }
}

// CREATE feedback
export async function createFeedback(data) {
    try {
        const { data: result, error } = await supabase
            .from("feedback")
            .insert([data])
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error("Error in createFeedback:", error.message);
        throw error;
    }
}

// REPLY to feedback (sets reply text and status to 'Dibalas')
export async function replyFeedback(id, reply) {
    try {
        const { data: result, error } = await supabase
            .from("feedback")
            .update({ 
                reply: reply, 
                status: "Dibalas", 
                updatedAt: new Date().toISOString() 
            })
            .eq("id", id)
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error(`Error in replyFeedback (${id}):`, error.message);
        throw error;
    }
}

// UPDATE feedback status
export async function updateFeedbackStatus(id, status) {
    try {
        const { data: result, error } = await supabase
            .from("feedback")
            .update({ 
                status: status, 
                updatedAt: new Date().toISOString() 
            })
            .eq("id", id)
            .select();

        if (error) throw error;
        return result?.[0] ?? null;
    } catch (error) {
        console.error(`Error in updateFeedbackStatus (${id}):`, error.message);
        throw error;
    }
}
