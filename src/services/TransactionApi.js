import { supabase } from "./supabaseClient";

// Helper to map Supabase transaction to UI conventions
const mapTransactionFromDB = (t) => {
    if (!t) return null;
    const customerName = t.customers?.customerName || t.customerName || "";
    const customerCode = t.customers?.customerCode || t.customerCode || "";
    return {
        ...t,
        transactionId: t.transactionCode, // Map transactionCode to transactionId
        customerId: customerCode,         // Map customerCode to customerId for UI
        customerName,
        status: (t.status || "Menunggu").toLowerCase()
    };
};

// GET all transactions with customer details
export async function getTransactions() {
    try {
        const { data, error } = await supabase
            .from("transactions")
            .select("*, customers(customerCode, customerName)")
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return (data || []).map(mapTransactionFromDB);
    } catch (error) {
        console.error("Error in getTransactions:", error.message);
        throw error;
    }
}

// GET transaction by id with customer details
export async function getTransactionById(id) {
    try {
        const { data, error } = await supabase
            .from("transactions")
            .select("*, customers(customerCode, customerName)")
            .eq("id", id)
            .single();

        if (error) throw error;
        return mapTransactionFromDB(data);
    } catch (error) {
        console.error(`Error in getTransactionById (${id}):`, error.message);
        throw error;
    }
}

// GET transactions by customerId (can be customerCode or customer UUID)
export async function getTransactionByCustomer(customerId) {
    try {
        let custUuid = customerId;
        
        // If customerId is a customerCode (string CUST-XXXX), resolve its UUID first
        if (typeof customerId === "string" && customerId.startsWith("CUST-")) {
            const { data: cust } = await supabase
                .from("customers")
                .select("id")
                .eq("customerCode", customerId)
                .maybeSingle();
            if (cust) {
                custUuid = cust.id;
            }
        }

        const { data, error } = await supabase
            .from("transactions")
            .select("*, customers(customerCode, customerName)")
            .eq("customerId", custUuid)
            .order("createdAt", { ascending: false });

        if (error) throw error;
        return (data || []).map(mapTransactionFromDB);
    } catch (error) {
        console.error(`Error in getTransactionByCustomer (${customerId}):`, error.message);
        throw error;
    }
}

// CREATE transaction (resolves customer UUID from customerCode)
export async function createTransaction(data) {
    try {
        let custUuid = data.customerId;
        let customerName = data.customerName || "";

        // Resolve customer UUID if it is a customerCode (CUST-XXXX)
        if (typeof data.customerId === "string" && data.customerId.startsWith("CUST-")) {
            const { data: cust } = await supabase
                .from("customers")
                .select("id, customerName")
                .eq("customerCode", data.customerId)
                .maybeSingle();
            if (cust) {
                custUuid = cust.id;
                customerName = cust.customerName;
            }
        }

        const payload = {
            transactionCode: data.transactionId || data.transactionCode,
            customerId: custUuid,
            service: data.service,
            weight: Number(data.weight || 0),
            pricePerKg: Number(data.pricePerKg || 0),
            total: Number(data.total || 0),
            paymentMethod: data.paymentMethod,
            receivedDate: data.receivedDate || new Date().toISOString().split("T")[0],
            estimatedDate: data.estimatedDate,
            completedDate: data.completedDate || null,
            status: data.status ? (data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()) : "Menunggu",
            notes: data.notes || "",
            qrCode: data.qrCode || null,
            createdBy: data.createdBy || null
        };

        const { data: result, error } = await supabase
            .from("transactions")
            .insert([payload])
            .select();

        if (error) throw error;
        
        const inserted = result?.[0];
        
        // Initialize tracking automatically for the new transaction
        if (inserted) {
            const { data: track } = await supabase
                .from("tracking")
                .insert([{
                    transactionId: inserted.id,
                    currentStatus: "Pesanan Diterima"
                }])
                .select();
                
            if (track && track[0]) {
                await supabase
                    .from("tracking_history")
                    .insert([{
                        trackingId: track[0].id,
                        step: "Pesanan Diterima",
                        status: true,
                        description: "Pesanan berhasil diterima oleh laundry.",
                        time: new Date().toISOString()
                    }]);
            }
        }

        return mapTransactionFromDB({ 
            ...inserted, 
            customers: { customerCode: data.customerId, customerName } 
        });
    } catch (error) {
        console.error("Error in createTransaction:", error.message);
        throw error;
    }
}

// UPDATE transaction by id
export async function updateTransaction(id, data) {
    try {
        const payload = {};
        if (data.status !== undefined) {
            payload.status = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase();
            if (payload.status === "Selesai") {
                payload.completedDate = new Date().toISOString().split("T")[0];
            }
        }
        if (data.weight !== undefined) payload.weight = Number(data.weight);
        if (data.total !== undefined) payload.total = Number(data.total);
        if (data.paymentMethod !== undefined) payload.paymentMethod = data.paymentMethod;
        if (data.notes !== undefined) payload.notes = data.notes;
        
        const { data: result, error } = await supabase
            .from("transactions")
            .update(payload)
            .eq("id", id)
            .select();

        if (error) throw error;
        return mapTransactionFromDB(result?.[0]) ?? null;
    } catch (error) {
        console.error(`Error in updateTransaction (${id}):`, error.message);
        throw error;
    }
}

// DELETE transaction by id
export async function deleteTransaction(id) {
    try {
        const { data, error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;
        return (data || []).map(mapTransactionFromDB);
    } catch (error) {
        console.error(`Error in deleteTransaction (${id}):`, error.message);
        throw error;
    }
}
