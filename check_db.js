import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envText = fs.readFileSync(".env", "utf8");
const urlMatch = envText.match(/VITE_SUPABASE_URL\s*=\s*(.*)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : null;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = ["users", "customers", "transactions", "tracking", "tracking_history", "feedback", "loyalty_transactions", "notifications", "settings"];

async function checkAll() {
  for (const t of tables) {
    try {
      const { data, error } = await supabase.from(t).select("id");
      if (error) {
        console.log(`Table ${t}: ERROR`, error.message);
      } else {
        console.log(`Table ${t}: count =`, data.length);
      }
    } catch (e) {
      console.log(`Table ${t}: EXCEPTION`, e.message);
    }
  }
}

checkAll();
