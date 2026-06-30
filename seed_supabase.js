import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envText = fs.readFileSync(".env", "utf8");
const urlMatch = envText.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : null;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  try {
    console.log("Cleaning up old test data...");
    await supabase.from("feedback").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tracking_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("tracking").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("customers").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    console.log("Seeding settings...");
    const { error: sErr } = await supabase.from("settings").upsert([{
      laundryName: "Netto Express Laundry",
      promoTitle: "Promo Spesial Netto",
      promoDescription: "Diskon hemat potongan harga 10% untuk minimal cuci 5 kg.",
      promoDiscount: 10.00,
      promoStartDate: new Date().toISOString().split("T")[0],
      promoEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      promoStatus: true
    }]);
    if (sErr) console.error("Settings seed error:", sErr.message);

    console.log("Seeding customers...");
    const rawCustomers = JSON.parse(fs.readFileSync("src/data/customers.json", "utf8"));
    const customersToInsert = rawCustomers.slice(0, 15).map((c, idx) => {
      const hist = c.transactionHistory?.[0] || {};
      const rawCode = hist.customerId || `CUST-000${idx + 1}`;
      const customerCode = rawCode.replace(/([A-Z]+)(\d+)/i, "$1-$2");
      return {
        customerCode,
        customerName: c.customerName,
        phone: c.phone || `0812${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: c.email || `customer${idx + 1}@example.com`,
        address: c.address || "Jl. Sudirman No. 1, Pekanbaru",
        customerType: c.customerType || "Umum",
        maritalStatus: "Belum Menikah",
        joinDate: hist.joinDate || new Date().toISOString().split("T")[0],
        points: Number(hist.points || 0),
        totalTransactions: Number(hist.totalTransactions || 0),
        totalSpent: Number(hist.totalSpent || 0),
        segment: hist.segment || "New",
        status: hist.status === "inactive" ? "Inactive" : "Active"
      };
    });

    const { data: insertedCustomers, error: custErr } = await supabase
      .from("customers")
      .insert(customersToInsert)
      .select();

    if (custErr) {
      console.error("Customers insert error:", custErr.message, custErr.details);
      throw custErr;
    }

    const custMap = {};
    insertedCustomers.forEach(c => {
      custMap[c.customerCode] = c.id;
    });

    console.log("Seeding transactions...");
    const rawTransactions = JSON.parse(fs.readFileSync("src/data/transactions.json", "utf8"));
    const transactionsToInsert = [];
    const createdTrxCodes = new Set();

    rawTransactions.forEach(t => {
      const rawCustCode = t.customerId.replace(/([A-Z]+)(\d+)/i, "$1-$2");
      const customerUuid = custMap[rawCustCode];
      
      if (customerUuid && transactionsToInsert.length < 15 && !createdTrxCodes.has(t.id)) {
        createdTrxCodes.add(t.id);
        transactionsToInsert.push({
          transactionCode: t.id,
          customerId: customerUuid,
          service: t.service,
          weight: Number(t.weight || 0),
          pricePerKg: Number(t.pricePerKg || 0),
          total: Number(t.total || 0),
          paymentMethod: t.paymentMethod || "Cash",
          receivedDate: t.date || new Date().toISOString().split("T")[0],
          estimatedDate: new Date(new Date(t.date || Date.now()).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: t.status ? (t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase()) : "Menunggu",
          notes: "Pesanan masuk dari data migrasi awal.",
          qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://nettoexpress.com/tracking/' + t.id)}`
        });
      }
    });

    const { data: insertedTransactions, error: trxErr } = await supabase
      .from("transactions")
      .insert(transactionsToInsert)
      .select();

    if (trxErr) {
      console.error("Transactions insert error:", trxErr.message, trxErr.details);
      throw trxErr;
    }

    console.log("Seeding tracking...");
    for (const trx of insertedTransactions) {
      const { data: track, error: trackErr } = await supabase
        .from("tracking")
        .insert([{
          transactionId: trx.id,
          currentStatus: "Pesanan Diterima"
        }])
        .select()
        .single();

      if (trackErr) {
        console.error("Tracking insert error:", trackErr.message);
        continue;
      }

      const { error: histErr } = await supabase
        .from("tracking_history")
        .insert([{
          trackingId: track.id,
          step: "Pesanan Diterima",
          status: true,
          description: "Pesanan berhasil diterima oleh laundry.",
          time: trx.receivedDate
        }]);
      if (histErr) console.error("Tracking history error:", histErr.message);
    }

    console.log("Seeding feedbacks...");
    const rawFeedback = JSON.parse(fs.readFileSync("src/data/feedback.json", "utf8"));
    const feedbacksToInsert = rawFeedback.slice(0, 5).map((f, idx) => {
      const randomCust = insertedCustomers[idx % insertedCustomers.length];
      const randomTrx = insertedTransactions[idx % insertedTransactions.length];
      return {
        customerId: randomCust.id,
        transactionId: randomTrx.id,
        rating: Number(f.rating || 5),
        category: f.category || "Kebersihan",
        comment: f.comment || "Cucian wangi, pelayanan sangat memuaskan!",
        reply: f.status === "dibalas" ? "Terima kasih atas masukannya!" : null
      };
    });

    const { error: fbErr } = await supabase.from("feedback").insert(feedbacksToInsert);
    if (fbErr) console.error("Feedback error:", fbErr.message);

    console.log("Done seeding!");
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

seed();
