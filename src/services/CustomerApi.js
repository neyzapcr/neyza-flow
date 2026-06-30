import { supabase } from "./supabaseClient";

// Helper to map Supabase customer to UI conventions
const mapCustomerFromDB = (c) => {
    if (!c) return null;
    return {
        ...c,
        customerId: c.customerCode, // Map customerCode to customerId
        status: c.status === "Active" ? "active" : "inactive"
    };
};

// Helper to map UI customer to Supabase conventions
const mapCustomerToDB = (c) => {
    if (!c) return null;
    const copy = { ...c };
    if (copy.customerId !== undefined) {
        copy.customerCode = copy.customerId;
        delete copy.customerId;
    }
    if (copy.status !== undefined) {
        copy.status = copy.status === "active" ? "Active" : "Inactive";
    }
    return copy;
};

// GET all customers
export async function getCustomers() {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .order("createdAt", { ascending: false });
        
        if (error) throw error;
        return (data || []).map(mapCustomerFromDB);
    } catch (error) {
        console.error("Error in getCustomers:", error.message);
        throw error;
    }
}

// GET customer by id (UUID primary key)
export async function getCustomerById(id) {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return mapCustomerFromDB(data);
    } catch (error) {
        console.error(`Error in getCustomerById (${id}):`, error.message);
        throw error;
    }
}

// GET customer by userId (BIGINT linked user)
export async function getCustomerByUserId(userId) {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("userId", userId)
            .single();

        if (error) throw error;
        return mapCustomerFromDB(data);
    } catch (error) {
        console.error(`Error in getCustomerByUserId (${userId}):`, error.message);
        throw error;
    }
}

// SEARCH customers by customerName or phone using .or()
export async function searchCustomers(keyword) {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .or(`customerName.ilike.%${keyword}%,phone.ilike.%${keyword}%`)
            .order("customerName", { ascending: true });

        if (error) throw error;
        return (data || []).map(mapCustomerFromDB);
    } catch (error) {
        console.error(`Error in searchCustomers (${keyword}):`, error.message);
        throw error;
    }
}

// CREATE customer
export async function createCustomer(data) {
    try {
        const payload = mapCustomerToDB(data);
        const { data: result, error } = await supabase
            .from("customers")
            .insert([payload])
            .select();

        if (error) throw error;
        return mapCustomerFromDB(result?.[0]) ?? null;
    } catch (error) {
        console.error("Error in createCustomer:", error.message);
        throw error;
    }
}

// UPDATE customer by id
export async function updateCustomer(id, data) {
    try {
        const payload = mapCustomerToDB(data);
        const { data: result, error } = await supabase
            .from("customers")
            .update(payload)
            .eq("id", id)
            .select();

        if (error) throw error;
        return mapCustomerFromDB(result?.[0]) ?? null;
    } catch (error) {
        console.error(`Error in updateCustomer (${id}):`, error.message);
        throw error;
    }
}

// DELETE customer by id
export async function deleteCustomer(id) {
    try {
        const { data, error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;
        return (data || []).map(mapCustomerFromDB);
    } catch (error) {
        console.error(`Error in deleteCustomer (${id}):`, error.message);
        throw error;
    }
}
