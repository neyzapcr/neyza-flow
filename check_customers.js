import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Read .env file
const envText = fs.readFileSync(".env", "utf8");
const urlMatch = envText.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Credentials not found in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCustomers() {
  try {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) throw error;
    console.log("Customers count:", data.length);
    console.log("Customers first 5 rows:", data.slice(0, 5));
  } catch (err) {
    console.error("Error fetching customers:", err.message);
  }
}

checkCustomers();
