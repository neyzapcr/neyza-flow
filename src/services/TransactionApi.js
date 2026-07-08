import { supabase } from "./supabaseClient.js";

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

// Central helper to recalculate and synchronize customer stats in database
// Central helper to recalculate and synchronize customer stats in database
export async function syncCustomerStats(customerId) {
    if (!customerId) return;
    try {
        // 1. Fetch all transactions for this customer
        const { data: transactions, error: trxErr } = await supabase
            .from("transactions")
            .select("id, total, status, notes, transactionCode, receivedDate")
            .eq("customerId", customerId);
        
        if (trxErr) throw trxErr;

        const customerTrx = transactions || [];

        // 2. Rebuild transaction-generated loyalty records while preserving non-transaction loyalty records
        // Fetch all loyalty transactions for this customer
        const { data: existingLoyalty, error: fetchLoyaltyErr } = await supabase
            .from("loyalty_transactions")
            .select("id, transactionId")
            .eq("customerId", customerId);
            
        if (fetchLoyaltyErr) throw fetchLoyaltyErr;

        // Filter for records that have a transactionId (i.e. transaction-generated)
        const loyaltyIdsToDelete = (existingLoyalty || [])
            .filter(l => l.transactionId !== null)
            .map(l => l.id);

        if (loyaltyIdsToDelete.length > 0) {
            const { error: delErr } = await supabase
                .from("loyalty_transactions")
                .delete()
                .in("id", loyaltyIdsToDelete);
            if (delErr) throw delErr;
        }

        // Insert rebuilt loyalty transactions based on active transactions data
        const loyaltyInserts = [];
        customerTrx.forEach((t) => {
            // Points earned: 1 point for every Rp 2.000 spent
            const pointsEarned = Math.floor((t.total || 0) / 2000);
            if (pointsEarned > 0) {
                loyaltyInserts.push({
                    customerId: customerId,
                    transactionId: t.id,
                    points: pointsEarned,
                    type: "Tambah",
                    description: `Poin dari transaksi ${t.transactionCode || t.id}`
                });
            }

            // Points redeemed: check notes for [PROMO_POINTS_USED:xxx]
            if (t.notes) {
                const match = t.notes.match(/\[PROMO_POINTS_USED:(\d+)\]/);
                if (match && match[1]) {
                    const pointsRedeemed = parseInt(match[1], 10);
                    if (pointsRedeemed > 0) {
                        loyaltyInserts.push({
                            customerId: customerId,
                            transactionId: t.id,
                            points: pointsRedeemed,
                            type: "Tukar",
                            description: `Penggunaan promo loyalitas pada transaksi ${t.transactionCode || t.id}`
                        });
                    }
                }
            }
        });

        if (loyaltyInserts.length > 0) {
            const { error: insErr } = await supabase
                .from("loyalty_transactions")
                .insert(loyaltyInserts);
            if (insErr) throw insErr;
        }

        // 3. Compute summary statistics
        const totalTransactions = customerTrx.length;
        const totalSpent = customerTrx.reduce((sum, t) => sum + (t.total || 0), 0);

        // Fetch all remaining loyalty transactions (preserved non-transaction + newly rebuilt ones)
        const { data: loyaltyTrxs, error: loyaltyErr } = await supabase
            .from("loyalty_transactions")
            .select("points, type")
            .eq("customerId", customerId);
        
        if (loyaltyErr) throw loyaltyErr;

        let points = 0;
        (loyaltyTrxs || []).forEach((l) => {
            if (l.type === "Tambah") {
                points += (l.points || 0);
            } else if (l.type === "Tukar") {
                points -= (l.points || 0);
            }
        });
        if (points < 0) points = 0;

        // Determine tier segment
        let segment = "New";
        if (points >= 500) segment = "VIP";
        else if (points >= 300) segment = "Loyal";
        else if (points >= 100) segment = "Regular";

        // Find lastTransaction date
        let lastTransaction = null;
        if (customerTrx.length > 0) {
            const sorted = [...customerTrx]
                .filter(t => t.receivedDate)
                .sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));
            if (sorted[0]) {
                lastTransaction = sorted[0].receivedDate;
            }
        }

        // Update customer in database
        const { error: updateErr } = await supabase
            .from("customers")
            .update({
                totalTransactions,
                totalSpent,
                points,
                segment,
                lastTransaction,
                updatedAt: new Date().toISOString()
            })
            .eq("id", customerId);

        if (updateErr) throw updateErr;

    } catch (error) {
        console.error(`Error in syncCustomerStats (${customerId}):`, error.message);
    }
}

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
        
        if (inserted && custUuid) {
            // Trigger customer stats and loyalty point sync immediately
            await syncCustomerStats(custUuid);
        }

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

        // Fetch transaction customerId before updating so we know whose stats to sync
        const { data: oldTrx } = await supabase
            .from("transactions")
            .select("customerId")
            .eq("id", id)
            .maybeSingle();

        const { data: result, error } = await supabase
            .from("transactions")
            .update(payload)
            .eq("id", id)
            .select();

        if (error) throw error;

        if (oldTrx && oldTrx.customerId) {
            // Trigger customer stats and loyalty point sync immediately
            await syncCustomerStats(oldTrx.customerId);
        }

        return mapTransactionFromDB(result?.[0]) ?? null;
    } catch (error) {
        console.error(`Error in updateTransaction (${id}):`, error.message);
        throw error;
    }
}

// DELETE transaction by id
export async function deleteTransaction(id) {
    try {
        // Fetch transaction customerId before deleting so we can sync after deletion
        const { data: oldTrx } = await supabase
            .from("transactions")
            .select("customerId")
            .eq("id", id)
            .maybeSingle();

        // Delete associated loyalty transactions first to avoid orphan NULLs in loyalty_transactions
        const { error: loyaltyDelErr } = await supabase
            .from("loyalty_transactions")
            .delete()
            .eq("transactionId", id);

        if (loyaltyDelErr) {
            console.error("Error deleting loyalty transactions on transaction delete:", loyaltyDelErr.message);
        }

        const { data, error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .select();

        if (error) throw error;

        if (oldTrx && oldTrx.customerId) {
            // Trigger customer stats and loyalty point sync immediately after deletion
            await syncCustomerStats(oldTrx.customerId);
        }

        return (data || []).map(mapTransactionFromDB);
    } catch (error) {
        console.error(`Error in deleteTransaction (${id}):`, error.message);
        throw error;
    }
}

