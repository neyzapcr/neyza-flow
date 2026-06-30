import { supabase } from "./supabaseClient";
import customersData from "../data/customers.json";
import transactionsData from "../data/transactions.json";
import feedbackData from "../data/feedback.json";
import statusData from "../data/laundryStatus.json";

// Helper for local storage fallback
const fallbackStorage = {
  get(key, initialData) {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(val);
  },
  set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Seed initial data for local storage
const getInitialCustomers = () => {
  return customersData.flatMap((c, idx) => {
    const historyList = c.transactionHistory || [];
    const baseCust = {
      id: `uuid-cust-${idx + 1}`,
      userId: null,
      customerName: c.customerName,
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
      customerType: c.customerType || "Umum",
      maritalStatus: "Belum Menikah",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (historyList.length === 0) {
      return [{
        ...baseCust,
        customerCode: `CUST-${String(idx + 1).padStart(4, "0")}`,
        joinDate: new Date().toISOString().split("T")[0],
        points: 0,
        totalTransactions: 0,
        totalSpent: 0,
        segment: "New",
        lastTransaction: "-",
        status: "Active"
      }];
    }
    return historyList.map((history, hIdx) => ({
      ...baseCust,
      id: `uuid-cust-${idx + 1}-${hIdx}`,
      customerCode: history.customerId || `CUST-${String(idx + 1).padStart(4, "0")}`,
      joinDate: history.joinDate || new Date().toISOString().split("T")[0],
      points: history.points || 0,
      totalTransactions: history.totalTransactions || 0,
      totalSpent: history.totalSpent || 0,
      segment: history.segment || "New",
      lastTransaction: history.lastTransaction || "-",
      status: history.status === "active" ? "Active" : "Inactive"
    }));
  });
};

const getInitialTransactions = () => {
  return transactionsData.map((t, idx) => ({
    id: `uuid-trx-${idx + 1}`,
    transactionCode: t.id,
    customerId: "uuid-cust-1", // mock internal UUID
    customerCode: t.customerId || "CUST-0001",
    customerName: t.customerName, 
    service: t.service,
    weight: t.weight || 0,
    pricePerKg: t.pricePerKg || 0,
    total: t.total || 0,
    paymentMethod: t.paymentMethod || "Cash",
    receivedDate: t.date || new Date().toISOString().split("T")[0],
    estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    completedDate: t.status === "selesai" ? t.date : null,
    status: t.status === "selesai" ? "Selesai" : t.status === "diproses" ? "Diproses" : "Menunggu",
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + '/tracking/' + t.id)}`,
    createdBy: null,
    createdAt: new Date().toISOString()
  }));
};

const getInitialFeedback = () => {
  return feedbackData.map((f, idx) => ({
    id: `uuid-fb-${idx + 1}`,
    customerId: "uuid-cust-1",
    customerCode: f.customerId ? `CUST-${String(f.customerId).padStart(4, "0")}` : "CUST-0001",
    customerName: f.customerName,
    transactionId: "uuid-trx-1",
    transactionCode: f.transactionId || "TRX-0001",
    rating: f.rating || 5,
    category: f.category || "Umum",
    comment: f.comment || "",
    reply: "",
    status: f.status === "dibalas" ? "Dibalas" : "Belum Dibalas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

const getInitialPromotions = () => {
  return [
    {
      id: "uuid-promo-1",
      title: "Promo Hemat Mahasiswa",
      description: "Diskon Rp 2.000/kg khusus untuk jenis pelanggan Pelajar dan Mahasiswa.",
      discount: 2000,
      targetSegment: "New",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      status: "Active"
    },
    {
      id: "uuid-promo-2",
      title: "Loyal Member Reward",
      description: "Potongan langsung Rp 10.000 untuk pelanggan setia segmen Loyal.",
      discount: 10000,
      targetSegment: "Loyal",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      status: "Active"
    },
    {
      id: "uuid-promo-3",
      title: "VIP Exclusive Discount",
      description: "Diskon 15% untuk layanan laundry premium VIP Netto Express.",
      discount: 15000,
      targetSegment: "VIP",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      status: "Active"
    }
  ];
};

// Mapper helpers to make database column names backward compatible with code
const mapCustomer = (c) => {
  if (!c) return null;
  return {
    ...c,
    customerId: c.customerCode, // Codebase uses customerId
    status: c.status === "Active" ? "active" : "inactive"
  };
};

const mapTransaction = (t) => {
  if (!t) return null;
  const customerName = t.customers?.customerName || t.customerName || "";
  const customerCode = t.customers?.customerCode || t.customerCode || "";
  return {
    ...t,
    transactionId: t.transactionCode, // Codebase uses transactionId
    customerId: customerCode,
    customerName,
    status: (t.status || "Menunggu").toLowerCase()
  };
};

export const dbAPI = {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. CUSTOMERS
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(mapCustomer);
    } catch (err) {
      console.warn("Supabase query failed for customers. Falling back.", err);
      return fallbackStorage.get("netto_customers", getInitialCustomers()).map(mapCustomer);
    }
  },

  async fetchCustomerById(customerId) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("customerCode", customerId)
        .single();
      if (error) throw error;
      return mapCustomer(data);
    } catch (err) {
      const list = await this.fetchCustomers();
      return list.find((c) => c.customerId === customerId) || null;
    }
  },

  async fetchCustomerByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("userId", userId)
        .single();
      if (error) throw error;
      return mapCustomer(data);
    } catch (err) {
      const list = await this.fetchCustomers();
      return list.find((c) => c.userId === userId) || null;
    }
  },

  async createCustomer(customer) {
    const payload = {
      customerCode: customer.customerId, 
      userId: customer.userId || null,
      customerName: customer.customerName,
      phone: customer.phone || null,
      email: customer.email || null,
      address: customer.address || null,
      customerType: customer.customerType || "Umum",
      maritalStatus: customer.maritalStatus || "Belum Menikah",
      joinDate: customer.joinDate || new Date().toISOString().split("T")[0],
      points: customer.points || 0,
      totalTransactions: customer.totalTransactions || 0,
      totalSpent: customer.totalSpent || 0,
      segment: customer.segment || "New",
      lastTransaction: customer.lastTransaction !== "-" ? customer.lastTransaction : null,
      status: customer.status === "active" ? "Active" : "Inactive"
    };

    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([payload])
        .select();
      if (error) throw error;
      return mapCustomer(data?.[0]) || customer;
    } catch (err) {
      console.warn("Supabase create customer failed. Falling back.", err);
      const list = fallbackStorage.get("netto_customers", getInitialCustomers());
      const newCust = { ...payload, id: `uuid-cust-${Date.now()}` };
      list.push(newCust);
      fallbackStorage.set("netto_customers", list);
      return mapCustomer(newCust);
    }
  },

  async updateCustomer(customerId, updatedFields) {
    const payload = {
      customerName: updatedFields.customerName,
      phone: updatedFields.phone,
      email: updatedFields.email,
      address: updatedFields.address,
      customerType: updatedFields.customerType,
      maritalStatus: updatedFields.maritalStatus,
      points: updatedFields.points,
      totalTransactions: updatedFields.totalTransactions,
      totalSpent: updatedFields.totalSpent,
      segment: updatedFields.segment,
      status: updatedFields.status === "active" ? "Active" : "Inactive",
      updatedAt: new Date().toISOString()
    };
    
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    try {
      const { data, error } = await supabase
        .from("customers")
        .update(payload)
        .eq("customerCode", customerId)
        .select();
      if (error) throw error;
      return mapCustomer(data?.[0]);
    } catch (err) {
      console.warn("Supabase update customer failed. Falling back.", err);
      const list = fallbackStorage.get("netto_customers", getInitialCustomers());
      const idx = list.findIndex(c => c.customerCode === customerId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...payload };
        fallbackStorage.set("netto_customers", list);
        return mapCustomer(list[idx]);
      }
      return null;
    }
  },

  async deleteCustomer(customerId) {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("customerCode", customerId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Supabase delete customer failed. Falling back.", err);
      const list = fallbackStorage.get("netto_customers", getInitialCustomers());
      const filtered = list.filter((c) => c.customerCode !== customerId);
      fallbackStorage.set("netto_customers", filtered);
      return true;
    }
  },

  async linkCustomerAccount(userId, email, phone) {
    try {
      let query = supabase.from("customers").select("*");
      if (email) query = query.eq("email", email);
      else if (phone) query = query.eq("phone", phone);

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const target = data[0];
        if (!target.userId) {
          await supabase
            .from("customers")
            .update({ userId, updatedAt: new Date().toISOString() })
            .eq("id", target.id);
        }
      }
    } catch (err) {
      console.warn("Link customer account failed. Falling back.", err);
      const list = fallbackStorage.get("netto_customers", getInitialCustomers());
      const idx = list.findIndex(c => (email && c.email === email) || (phone && c.phone === phone));
      if (idx !== -1 && !list[idx].userId) {
        list[idx].userId = userId;
        list[idx].updatedAt = new Date().toISOString();
        fallbackStorage.set("netto_customers", list);
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. TRANSACTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, customers(customerCode, customerName)")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(mapTransaction);
    } catch (err) {
      console.warn("Supabase fetch transactions failed. Falling back.", err);
      return fallbackStorage.get("netto_transactions", getInitialTransactions()).map(mapTransaction);
    }
  },

  async fetchTransactionById(transactionId) {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, customers(customerCode, customerName)")
        .eq("transactionCode", transactionId)
        .single();
      if (error) throw error;
      return mapTransaction(data);
    } catch (err) {
      const list = await this.fetchTransactions();
      return list.find((t) => t.transactionId === transactionId) || null;
    }
  },

  async fetchTransactionsByCustomerId(customerCode) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", customerCode)
        .single();
      if (custErr) throw custErr;

      const { data, error } = await supabase
        .from("transactions")
        .select("*, customers(customerCode, customerName)")
        .eq("customerId", cust.id)
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(mapTransaction);
    } catch (err) {
      const list = await this.fetchTransactions();
      return list.filter((t) => t.customerId === customerCode);
    }
  },

  async createTransaction(transaction) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", transaction.customerId)
        .single();
      if (custErr) throw custErr;

      const payload = {
        transactionCode: transaction.transactionId,
        customerId: cust.id,
        service: transaction.service,
        weight: transaction.weight,
        pricePerKg: transaction.pricePerKg,
        total: transaction.total,
        paymentMethod: transaction.paymentMethod,
        receivedDate: transaction.receivedDate,
        estimatedDate: transaction.estimatedDate,
        completedDate: null,
        status: "Menunggu",
        notes: transaction.notes || "",
        qrCode: transaction.qrCode,
        createdBy: transaction.createdBy || null
      };

      const { data: insertedTrx, error } = await supabase
        .from("transactions")
        .insert([payload])
        .select();
      if (error) throw error;

      const trxUuid = insertedTrx[0].id;

      // Create tracking
      const { data: insertedTrack, error: trackErr } = await supabase
        .from("tracking")
        .insert([{
          transactionId: trxUuid,
          currentStatus: "Pesanan Diterima"
        }])
        .select();
      if (trackErr) throw trackErr;

      const trackingUuid = insertedTrack[0].id;

      // Initial tracking history
      await supabase
        .from("tracking_history")
        .insert([{
          trackingId: trackingUuid,
          step: "Pesanan Diterima",
          status: true,
          description: "Pesanan masuk ke sistem Netto Express"
        }]);

      return mapTransaction({ ...insertedTrx[0], customers: { customerCode: transaction.customerId, customerName: transaction.customerName } });
    } catch (err) {
      console.warn("Supabase create transaction failed. Falling back.", err);
      
      const list = fallbackStorage.get("netto_transactions", getInitialTransactions());
      const newTrx = {
        id: `uuid-trx-${Date.now()}`,
        transactionCode: transaction.transactionId,
        customerId: `uuid-cust-${Date.now()}`,
        customerCode: transaction.customerId,
        customerName: transaction.customerName,
        service: transaction.service,
        weight: transaction.weight,
        pricePerKg: transaction.pricePerKg,
        total: transaction.total,
        paymentMethod: transaction.paymentMethod,
        receivedDate: transaction.receivedDate,
        estimatedDate: transaction.estimatedDate,
        completedDate: null,
        status: "Menunggu",
        qrCode: transaction.qrCode,
        createdBy: null,
        createdAt: new Date().toISOString()
      };
      list.push(newTrx);
      fallbackStorage.set("netto_transactions", list);

      // Tracking local
      const trackingList = fallbackStorage.get("netto_tracking", []);
      const trackId = `uuid-trk-${Date.now()}`;
      trackingList.push({
        id: trackId,
        transactionId: newTrx.id,
        currentStatus: "Pesanan Diterima",
        updatedAt: new Date().toISOString()
      });
      fallbackStorage.set("netto_tracking", trackingList);

      const trackingHistoryList = fallbackStorage.get("netto_tracking_history", []);
      trackingHistoryList.push({
        id: `uuid-trh-${Date.now()}`,
        trackingId: trackId,
        step: "Pesanan Diterima",
        status: true,
        time: new Date().toISOString()
      });
      fallbackStorage.set("netto_tracking_history", trackingHistoryList);

      return mapTransaction(newTrx);
    }
  },

  async updateTransactionStatus(transactionCode, status, userId) {
    const dbStatus = status.charAt(0).toUpperCase() + status.slice(1); 

    try {
      const { data: trx, error: trxErr } = await supabase
        .from("transactions")
        .select("id, customerId, total")
        .eq("transactionCode", transactionCode)
        .single();
      if (trxErr) throw trxErr;

      const { data: updatedTrx, error } = await supabase
        .from("transactions")
        .update({
          status: dbStatus,
          completedDate: status.toLowerCase() === "selesai" ? new Date().toISOString().split("T")[0] : null,
          updatedAt: new Date().toISOString()
        })
        .eq("id", trx.id)
        .select();
      if (error) throw error;

      // Update or insert tracking row
      const { data: track, error: trackErr } = await supabase
        .from("tracking")
        .upsert({
          transactionId: trx.id,
          currentStatus: status,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        }, { onConflict: "transactionId" })
        .select();
      if (trackErr) throw trackErr;

      const trackingUuid = track[0].id;

      // Insert tracking history step
      await supabase
        .from("tracking_history")
        .insert([{
          trackingId: trackingUuid,
          step: status,
          status: true,
          updatedBy: userId,
          time: new Date().toISOString()
        }]);

      if (status.toLowerCase() === "selesai") {
        const pts = Math.floor(Number(trx.total) / 2000);
        if (pts > 0) {
          const { data: cust } = await supabase.from("customers").select("customerCode").eq("id", trx.customerId).single();
          if (cust) {
            await this.addLoyaltyPoints(cust.customerCode, pts, "Tambah", `Poin dari transaksi ${transactionCode}`, trx.id);
          }
        }
      }

      return mapTransaction(updatedTrx?.[0]);
    } catch (err) {
      console.warn("Supabase update transaction status failed. Falling back.", err);
      const list = fallbackStorage.get("netto_transactions", getInitialTransactions());
      const idx = list.findIndex(t => t.transactionCode === transactionCode);
      if (idx !== -1) {
        list[idx].status = dbStatus;
        list[idx].completedDate = status.toLowerCase() === "selesai" ? new Date().toISOString().split("T")[0] : null;
        fallbackStorage.set("netto_transactions", list);

        const localTrx = list[idx];

        const trackingList = fallbackStorage.get("netto_tracking", []);
        let trIdx = trackingList.findIndex(tk => tk.transactionId === localTrx.id);
        let trackId = `uuid-trk-${Date.now()}`;
        if (trIdx !== -1) {
          trackingList[trIdx].currentStatus = status;
          trackingList[trIdx].updatedAt = new Date().toISOString();
          trackId = trackingList[trIdx].id;
        } else {
          trackingList.push({
            id: trackId,
            transactionId: localTrx.id,
            currentStatus: status,
            updatedAt: new Date().toISOString()
          });
        }
        fallbackStorage.set("netto_tracking", trackingList);

        const trackingHistoryList = fallbackStorage.get("netto_tracking_history", []);
        trackingHistoryList.push({
          id: `uuid-trh-${Date.now()}`,
          trackingId: trackId,
          step: status,
          status: true,
          time: new Date().toISOString()
        });
        fallbackStorage.set("netto_tracking_history", trackingHistoryList);

        if (status.toLowerCase() === "selesai") {
          const pts = Math.floor(Number(localTrx.total) / 2000);
          if (pts > 0) {
            await this.addLoyaltyPoints(localTrx.customerCode, pts, "Tambah", `Poin dari transaksi ${transactionCode}`, localTrx.id);
          }
        }
        return mapTransaction(localTrx);
      }
      return null;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. TRACKING & TIMELINE
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchTrackingHistory(transactionCode) {
    try {
      const { data: trx, error: trxErr } = await supabase
        .from("transactions")
        .select("id")
        .eq("transactionCode", transactionCode)
        .single();
      if (trxErr) throw trxErr;

      const { data: track, error: trackErr } = await supabase
        .from("tracking")
        .select("id")
        .eq("transactionId", trx.id)
        .single();
      if (trackErr) throw trackErr;

      const { data, error } = await supabase
        .from("tracking_history")
        .select("*")
        .eq("trackingId", track.id)
        .order("time", { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Supabase fetch tracking history failed. Falling back.", err);
      const transactions = fallbackStorage.get("netto_transactions", getInitialTransactions());
      const localTrx = transactions.find(t => t.transactionCode === transactionCode);
      if (!localTrx) return [];

      const trackingList = fallbackStorage.get("netto_tracking", []);
      const localTrack = trackingList.find(tk => tk.transactionId === localTrx.id);
      if (!localTrack) return [];

      const trackingHistoryList = fallbackStorage.get("netto_tracking_history", []);
      return trackingHistoryList.filter(h => h.trackingId === localTrack.id);
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. LOYALTY & REWARDS
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchLoyaltyTransactions(customerCode) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", customerCode)
        .single();
      if (custErr) throw custErr;

      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("customerId", cust.id)
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(l => ({ ...l, loyaltyId: l.id }));
    } catch (err) {
      console.warn("Supabase loyalty query failed. Falling back.", err);
      const list = fallbackStorage.get("netto_loyalty_transactions", []);
      const matched = list.filter(l => l.customerCode === customerCode);
      return matched.map(l => ({ ...l, loyaltyId: l.id }));
    }
  },

  async addLoyaltyPoints(customerCode, points, type, description, transactionUuid) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id, points, totalSpent, totalTransactions, segment")
        .eq("customerCode", customerCode)
        .single();
      if (custErr) throw custErr;

      const loyaltyRecord = {
        customerId: cust.id,
        transactionId: transactionUuid || null,
        points,
        type,
        description
      };

      await supabase.from("loyalty_transactions").insert([loyaltyRecord]);

      const currentPoints = cust.points || 0;
      const newPoints = type === "Tambah" ? currentPoints + points : currentPoints - points;
      
      let segment = cust.segment || "New";
      if (newPoints >= 500) segment = "VIP";
      else if (newPoints >= 300) segment = "Loyal";
      else if (newPoints >= 100) segment = "Regular";
      else segment = "New";

      await supabase
        .from("customers")
        .update({
          points: newPoints,
          segment,
          lastTransaction: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString()
        })
        .eq("id", cust.id);

    } catch (err) {
      console.warn("Supabase add loyalty points failed. Falling back.", err);
      
      const localLoyalty = fallbackStorage.get("netto_loyalty_transactions", []);
      const record = {
        id: `uuid-loy-${Date.now()}`,
        customerCode,
        points,
        type,
        description,
        createdAt: new Date().toISOString()
      };
      localLoyalty.push(record);
      fallbackStorage.set("netto_loyalty_transactions", localLoyalty);

      const list = fallbackStorage.get("netto_customers", getInitialCustomers());
      const idx = list.findIndex(c => c.customerCode === customerCode);
      if (idx !== -1) {
        const newPoints = type === "Tambah" ? list[idx].points + points : list[idx].points - points;
        let segment = list[idx].segment || "New";
        if (newPoints >= 500) segment = "VIP";
        else if (newPoints >= 300) segment = "Loyal";
        else if (newPoints >= 100) segment = "Regular";
        else segment = "New";

        list[idx] = {
          ...list[idx],
          points: newPoints,
          segment,
          lastTransaction: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString()
        };
        fallbackStorage.set("netto_customers", list);
      }
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. PROMOTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchPromotions() {
    try {
      // Map setting promotions as first priority since table 'promotions' is removed in favor of settings fields
      const { data, error } = await supabase
        .from("settings")
        .select('"promoTitle", "promoDescription", "promoDiscount", "promoStartDate", "promoEndDate", "promoStatus"')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data && data.promoStatus) {
        return [{
          promoId: "PROMO-SETTING",
          title: data.promoTitle || "Promo Hemat",
          description: data.promoDescription || "Potongan harga spesial untuk Anda.",
          discount: Number(data.promoDiscount || 0),
          targetSegment: "Semua",
          startDate: data.promoStartDate || new Date().toISOString().split("T")[0],
          endDate: data.promoEndDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "Active"
        }];
      }
      return [];
    } catch (err) {
      console.warn("Supabase promotions fetch failed. Falling back.", err);
      return fallbackStorage.get("netto_promotions", getInitialPromotions()).map(p => ({ ...p, promoId: p.id }));
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. FEEDBACK
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchFeedback() {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*, customers(customerCode, customerName)")
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(f => ({
        ...f,
        feedbackId: f.id,
        customerId: f.customers?.customerCode || f.customerId,
        customerName: f.customers?.customerName || f.customerName || "Pelanggan"
      }));
    } catch (err) {
      console.warn("Supabase feedback failed. Falling back.", err);
      return fallbackStorage.get("netto_feedback", getInitialFeedback()).map(f => ({ ...f, feedbackId: f.id }));
    }
  },

  async createFeedback(feedbackRecord) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", feedbackRecord.customerId)
        .single();
      if (custErr) throw custErr;

      let transactionId = null;
      if (feedbackRecord.transactionId) {
        const { data: trx } = await supabase
          .from("transactions")
          .select("id")
          .eq("transactionCode", feedbackRecord.transactionId)
          .single();
        if (trx) transactionId = trx.id;
      }

      const payload = {
        customerId: cust.id,
        transactionId,
        rating: feedbackRecord.rating,
        category: feedbackRecord.category,
        comment: feedbackRecord.comment,
        status: "Belum Dibalas"
      };

      const { data, error } = await supabase
        .from("feedback")
        .insert([payload])
        .select();
      if (error) throw error;
      return { ...data?.[0], feedbackId: data?.[0].id };
    } catch (err) {
      console.warn("Supabase create feedback failed. Falling back.", err);
      const list = fallbackStorage.get("netto_feedback", getInitialFeedback());
      const newFb = {
        id: `uuid-fb-${Date.now()}`,
        customerCode: feedbackRecord.customerId,
        customerName: feedbackRecord.customerName || "Pelanggan",
        transactionCode: feedbackRecord.transactionId,
        rating: feedbackRecord.rating,
        category: feedbackRecord.category,
        comment: feedbackRecord.comment,
        status: "Belum Dibalas",
        createdAt: new Date().toISOString()
      };
      list.push(newFb);
      fallbackStorage.set("netto_feedback", list);
      return { ...newFb, feedbackId: newFb.id };
    }
  },

  async updateFeedbackStatus(feedbackId, status) {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .update({ status, updatedAt: new Date().toISOString() })
        .eq("id", feedbackId)
        .select();
      if (error) throw error;
      return { ...data?.[0], feedbackId: data?.[0].id };
    } catch (err) {
      console.warn("Supabase update feedback failed. Falling back.", err);
      const list = fallbackStorage.get("netto_feedback", getInitialFeedback());
      const idx = list.findIndex(f => f.id === feedbackId);
      if (idx !== -1) {
        list[idx].status = status;
        fallbackStorage.set("netto_feedback", list);
        return { ...list[idx], feedbackId: list[idx].id };
      }
      return null;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. NOTIFICATIONS
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchNotifications(customerCode) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", customerCode)
        .single();
      if (custErr) throw custErr;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("customerId", cust.id)
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data.map(n => ({ ...n, notificationId: n.id }));
    } catch (err) {
      console.warn("Supabase notifications query failed. Falling back.", err);
      const list = fallbackStorage.get("netto_notifications", []);
      return list.filter(n => n.customerCode === customerCode).map(n => ({ ...n, notificationId: n.id }));
    }
  },

  async createNotification(notification) {
    try {
      const { data: cust, error: custErr } = await supabase
        .from("customers")
        .select("id")
        .eq("customerCode", notification.customerId)
        .single();
      if (custErr) throw custErr;

      let transactionId = null;
      if (notification.transactionId) {
        const { data: trx } = await supabase
          .from("transactions")
          .select("id")
          .eq("transactionCode", notification.transactionId)
          .single();
        if (trx) transactionId = trx.id;
      }

      const payload = {
        customerId: cust.id,
        transactionId,
        title: notification.title,
        message: notification.message,
        type: notification.type || "Tracking"
      };

      const { data, error } = await supabase
        .from("notifications")
        .insert([payload])
        .select();
      if (error) throw error;
      return { ...data?.[0], notificationId: data?.[0].id };
    } catch (err) {
      const list = fallbackStorage.get("netto_notifications", []);
      const newNotif = {
        id: `uuid-ntf-${Date.now()}`,
        customerCode: notification.customerId,
        transactionCode: notification.transactionId,
        title: notification.title,
        message: notification.message,
        type: notification.type || "Tracking",
        isRead: false,
        createdAt: new Date().toISOString()
      };
      list.push(newNotif);
      fallbackStorage.set("netto_notifications", list);
      return { ...newNotif, notificationId: newNotif.id };
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ isRead: true, readAt: new Date().toISOString() })
        .eq("id", notificationId)
        .select();
      if (error) throw error;
      return { ...data?.[0], notificationId: data?.[0].id };
    } catch (err) {
      const list = fallbackStorage.get("netto_notifications", []);
      const idx = list.findIndex(n => n.id === notificationId);
      if (idx !== -1) {
        list[idx].isRead = true;
        fallbackStorage.set("netto_notifications", list);
        return { ...list[idx], notificationId: list[idx].id };
      }
      return null;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. SETTINGS (Mapped to Flat public.settings Table)
  // ─────────────────────────────────────────────────────────────────────────────
  async fetchSetting(key, defaultValue) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultValue;

      // Map DB columns to nested frontend state structures
      if (key === "services") {
        return [
          { id: 1, name: "Cuci + Setrika", regularPrice: Number(data.washIronPrice || 8000), expressPrice: Number(data.washIronPrice || 8000) + Number(data.expressPrice || 6000), active: true },
          { id: 2, name: "Cuci Kering", regularPrice: Number(data.washOnlyPrice || 7000), expressPrice: Number(data.washOnlyPrice || 7000) + Number(data.expressPrice || 5000), active: true },
          { id: 3, name: "Cuci + Setrika + Parfum", regularPrice: Number(data.washIronPrice || 8000) + 4000, expressPrice: Number(data.washIronPrice || 8000) + 4000 + Number(data.expressPrice || 6000), active: true },
          { id: 4, name: "Setrika Saja", regularPrice: Number(data.ironOnlyPrice || 5000), expressPrice: Number(data.ironOnlyPrice || 5000) + Number(data.expressPrice || 4000), active: true }
        ];
      }
      if (key === "points") {
        return {
          pointsPerRp: 2000,
          redeemRate: data.minimumRedeemPoint || 100,
          redeemValue: 5000,
          bonusVIP: 2,
          bonusLoyal: 1.5,
          expressBonus: 1.5
        };
      }
      if (key === "discounts") {
        if (data.promoStatus) {
          return [
            { id: 1, name: data.promoTitle || "Promo Aktif", type: "nominal", value: Number(data.promoDiscount || 0), minTransaction: 0, active: data.promoStatus }
          ];
        }
        return defaultValue;
      }
      if (key === "branding") {
        return {
          themePrimary: "#2940D3",
          themeSecondary: "#142297",
          landingPrimary: "#3957ED",
          landingSecondary: "#80C8F6",
          logoType: "text",
          logoUrlDark: "/img/logo Netto Dark.png",
          logoUrlLight: "/img/logo Netto light.png",
          logoText: data.laundryName || "Netto Laundry",
          logoIcon: "Shirt"
        };
      }

      return defaultValue;
    } catch (err) {
      console.warn(`Supabase setting fetch failed for key '${key}'. Falling back.`, err);
      return fallbackStorage.get(`netto_${key}`, defaultValue);
    }
  },

  async saveSetting(key, value) {
    try {
      // Find current row
      const { data: current } = await supabase.from("settings").select("*").limit(1);
      const row = current?.[0] || {};
      
      const payload = {
        laundryName: row.laundryName || "Netto Express Laundry",
        phone: row.phone || "081234567890",
        email: row.email || "info@nettoexpress.com",
        address: row.address || "Pekanbaru, Riau",
        openTime: row.openTime || "08:00:00",
        closeTime: row.closeTime || "21:00:00",
        washIronPrice: Number(row.washIronPrice || 8000),
        washOnlyPrice: Number(row.washOnlyPrice || 7000),
        ironOnlyPrice: Number(row.ironOnlyPrice || 5000),
        expressPrice: Number(row.expressPrice || 6000),
        pointPerTransaction: Number(row.pointPerTransaction || 10),
        minimumRedeemPoint: Number(row.minimumRedeemPoint || 100),
        promoTitle: row.promoTitle || "",
        promoDescription: row.promoDescription || "",
        promoDiscount: Number(row.promoDiscount || 0),
        promoStartDate: row.promoStartDate || null,
        promoEndDate: row.promoEndDate || null,
        promoStatus: row.promoStatus || false,
        estimatedWorkDays: Number(row.estimatedWorkDays || 2),
        currency: "IDR"
      };

      if (row.id) {
        payload.id = row.id;
      }

      // Map frontend updates back into row payload
      if (key === "services") {
        const washIron = value.find(s => s.name === "Cuci + Setrika");
        const washOnly = value.find(s => s.name === "Cuci Kering");
        const ironOnly = value.find(s => s.name === "Setrika Saja");
        if (washIron) payload.washIronPrice = Number(washIron.regularPrice);
        if (washOnly) payload.washOnlyPrice = Number(washOnly.regularPrice);
        if (ironOnly) payload.ironOnlyPrice = Number(ironOnly.regularPrice);
      }
      else if (key === "points") {
        payload.minimumRedeemPoint = Number(value.redeemRate);
      }
      else if (key === "branding") {
        payload.laundryName = value.logoText;
      }
      else if (key === "discounts") {
        const primaryPromo = value[0];
        if (primaryPromo) {
          payload.promoTitle = primaryPromo.name;
          payload.promoDiscount = Number(primaryPromo.value);
          payload.promoStatus = primaryPromo.active;
        }
      }

      await supabase.from("settings").upsert(payload);
      return value;
    } catch (err) {
      console.warn(`Supabase setting save failed for key '${key}'. Falling back.`, err);
      fallbackStorage.set(`netto_${key}`, value);
      return value;
    }
  }
};
