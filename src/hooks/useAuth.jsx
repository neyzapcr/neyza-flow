import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../services/supabaseClient";
import { syncCustomerStats } from "../services/TransactionApi";

const AuthContext = createContext(null);

// Helper to map DB user columns to UI naming conventions and normalize role capitalization
const mapUser = (u) => {
  if (!u) return null;
  
  // Normalize role spelling ('admin' -> 'Admin', 'member' -> 'Member', 'karyawan' -> 'Karyawan')
  let normalizedRole = u.role || "Member";
  if (normalizedRole.toLowerCase() === "admin") {
    normalizedRole = "Admin";
  } else if (normalizedRole.toLowerCase() === "member") {
    normalizedRole = "Member";
  } else if (normalizedRole.toLowerCase() === "karyawan") {
    normalizedRole = "Karyawan";
  }

  return {
    ...u,
    fullName: u.fullname || u.fullName || "User", // Map database fullname to camelCase fullName
    role: normalizedRole
  };
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to link customer account by email or full name and phone number
  const linkCustomerAccount = async (userId, userEmail, userFullname, userPhone) => {
    try {
      if (!userEmail) return;

      // 1. Coba cari berdasarkan email
      let { data: existingCust } = await supabase
        .from("customers")
        .select("*")
        .eq("email", userEmail);

      // 2. Jika tidak cocok, coba cari berdasarkan nama lengkap AND nomor telepon secara case-insensitive
      if ((!existingCust || existingCust.length === 0) && userFullname && userPhone) {
        const { data: matchedCust } = await supabase
          .from("customers")
          .select("*")
          .ilike("customerName", userFullname)
          .eq("phone", userPhone);

        if (matchedCust && matchedCust.length > 0) {
          existingCust = matchedCust;
        }
      }

      // 3. Cadangan terakhir: jika tidak ada email/telepon yang cocok, coba cari nama lengkap saja
      if ((!existingCust || existingCust.length === 0) && userFullname) {
        const { data: nameCust } = await supabase
          .from("customers")
          .select("*")
          .ilike("customerName", userFullname);

        if (nameCust && nameCust.length > 0) {
          existingCust = nameCust;
        }
      }

      if (existingCust && existingCust.length > 0) {
        // Sort existingCust to pick the primary one
        existingCust.sort((a, b) => {
          if (a.userId === userId && b.userId !== userId) return -1;
          if (b.userId === userId && a.userId !== userId) return 1;
          if (!a.userId && b.userId) return -1;
          if (a.userId && !b.userId) return 1;
          if (a.email === userEmail && b.email !== userEmail) return -1;
          if (b.email === userEmail && a.email !== userEmail) return 1;
          return (b.points || 0) - (a.points || 0);
        });

        const primary = existingCust[0];

        // Link primary customer to userId and backfill email/phone if needed
        const updatePayload = { userId, updatedAt: new Date().toISOString() };
        if (!primary.email) {
          updatePayload.email = userEmail;
        }
        if (userPhone && !primary.phone) {
          updatePayload.phone = userPhone;
        }
        
        await supabase
          .from("customers")
          .update(updatePayload)
          .eq("id", primary.id);

        // If there are duplicate records, merge all of their data into the primary record
        if (existingCust.length > 1) {
          const duplicates = existingCust.slice(1);
          for (const dup of duplicates) {
            // 1. Migrate transactions
            await supabase
              .from("transactions")
              .update({ customerId: primary.id })
              .eq("customerId", dup.id);

            // 2. Migrate loyalty transactions
            await supabase
              .from("loyalty_transactions")
              .update({ customerId: primary.id })
              .eq("customerId", dup.id);

            // 3. Delete duplicate customer record
            await supabase
              .from("customers")
              .delete()
              .eq("id", dup.id);
          }
        }

        // Recalculate and synchronize customer stats for the primary record
        await syncCustomerStats(primary.id);
      }
    } catch (err) {
      console.error("Failed to link customer account:", err);
    }
  };

  // Load profile and customer details by matching userId and email
  const loadProfile = async (userId, userEmail) => {
    setLoading(true);
    try {
      // 1. Load user details from public.users table using Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      
      const mappedUser = mapUser(data);

      // 2. Link customer account
      if (mappedUser) {
        await linkCustomerAccount(userId, userEmail, mappedUser.fullName, null);
      }

      setProfile(mappedUser ?? null);
      setRole(mappedUser?.role ?? null);

      // 3. Load or create corresponding customer record
      const { data: custRaw } = await supabase
        .from("customers")
        .select("*")
        .eq("userId", userId)
        .maybeSingle();

      let custData = custRaw ? {
        ...custRaw,
        customerId: custRaw.customerCode,
        status: custRaw.status === "Active" ? "active" : "inactive"
      } : null;

      if (!custData && mappedUser && (mappedUser.role === "Member" || mappedUser.role === "Admin" || mappedUser.role === "Karyawan")) {
        const generatedCustId = `CUST-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newCust = {
          customerCode: generatedCustId,
          userId: userId,
          customerName: mappedUser.fullName,
          phone: data?.phone || "",
          email: userEmail || data?.email || "",
          address: data?.address || "",
          customerType: "Umum",
          maritalStatus: "Belum Menikah",
          joinDate: new Date().toISOString().split("T")[0],
          points: 0,
          totalTransactions: 0,
          totalSpent: 0,
          segment: "New",
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const { data: insertedCust } = await supabase
          .from("customers")
          .insert([newCust])
          .select()
          .single();

        if (insertedCust) {
          custData = {
            ...insertedCust,
            customerId: insertedCust.customerCode,
            status: insertedCust.status === "Active" ? "active" : "inactive"
          };
        }
      }
      setCustomerProfile(custData ?? null);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setProfile(null);
      setCustomerProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize session from localStorage on application load and verify existence
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("netto_crm_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          
          // Verify with database that the user account still exists
          const { data: dbUser, error: dbUserErr } = await supabase
            .from("users")
            .select("*")
            .eq("id", parsed.id)
            .maybeSingle();

          if (dbUserErr || !dbUser) {
            // User has been deleted from database, clear credentials
            localStorage.removeItem("netto_crm_user");
            setUser(null);
            setSession(null);
            setProfile(null);
            setRole(null);
            setCustomerProfile(null);
            return;
          }

          const mapped = mapUser(dbUser);
          setUser(mapped);
          setSession(mapped);
          setProfile(mapped);
          setRole(mapped.role);
          localStorage.setItem("netto_crm_user", JSON.stringify(dbUser));

          // Load related customer details
          const { data: custRaw } = await supabase
            .from("customers")
            .select("*")
            .eq("userId", mapped.id)
            .maybeSingle();

          if (custRaw) {
            setCustomerProfile({
              ...custRaw,
              customerId: custRaw.customerCode,
              status: custRaw.status === "Active" ? "active" : "inactive"
            });
          }
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // Manual sign in querying public.users table directly
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error("Invalid login credentials");
      }

      const mapped = mapUser(data);
      setUser(mapped);
      setSession(mapped);
      setProfile(mapped);
      setRole(mapped.role);

      localStorage.setItem("netto_crm_user", JSON.stringify(data));

      // Link customer
      await linkCustomerAccount(mapped.id, mapped.email, mapped.fullName, null);

      // Load customer details
      const { data: custRaw } = await supabase
        .from("customers")
        .select("*")
        .eq("userId", mapped.id)
        .maybeSingle();

      if (custRaw) {
        setCustomerProfile({
          ...custRaw,
          customerId: custRaw.customerCode,
          status: custRaw.status === "Active" ? "active" : "inactive"
        });
      }

      return mapped;
    } catch (err) {
      console.error("Manual signIn failed:", err.message);
      throw err;
    }
  };

  // Manual sign up inserting into public.users table directly
  const signUp = async ({ email, password, fullName, phone, role = "Member" }) => {
    try {
      // Check if email already registered in public.users
      const { data: existing, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) {
        throw new Error("Email sudah terdaftar.");
      }

      // Insert new user record
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ 
          fullname: fullName, 
          email, 
          password, 
          role: role.toLowerCase() 
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const mapped = mapUser(newUser);
      setUser(mapped);
      setSession(mapped);
      setProfile(mapped);
      setRole(mapped.role);

      localStorage.setItem("netto_crm_user", JSON.stringify(newUser));

      // Link customer to the new user ID if email/name matches an existing customer
      await linkCustomerAccount(mapped.id, email, fullName, phone);

      // Load customer details
      const { data: custRaw } = await supabase
        .from("customers")
        .select("*")
        .eq("userId", mapped.id)
        .maybeSingle();

      if (custRaw) {
        setCustomerProfile({
          ...custRaw,
          customerId: custRaw.customerCode,
          status: custRaw.status === "Active" ? "active" : "inactive"
        });
      } else {
        // Create new customer record
        const generatedCustId = `CUST-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newCust = {
          customerCode: generatedCustId,
          userId: mapped.id,
          customerName: fullName,
          phone: phone || "",
          email: email,
          address: "",
          customerType: "Umum",
          maritalStatus: "Belum Menikah",
          joinDate: new Date().toISOString().split("T")[0],
          points: 0,
          totalTransactions: 0,
          totalSpent: 0,
          segment: "New",
          status: "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const { data: insertedCust, error: insertCustErr } = await supabase
          .from("customers")
          .insert([newCust])
          .select()
          .single();

        if (insertCustErr) throw insertCustErr;

        setCustomerProfile({
          ...insertedCust,
          customerId: insertedCust.customerCode,
          status: insertedCust.status === "Active" ? "active" : "inactive"
        });
      }

      return mapped;
    } catch (err) {
      console.error("Manual signUp failed:", err.message);
      throw err;
    }
  };

  // Sign out clearing session and local storage
  const signOut = async () => {
    try {
      localStorage.removeItem("netto_crm_user");
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setCustomerProfile(null);
    } catch (err) {
      console.error("SignOut error:", err);
    }
  };

  const value = {
    session,
    user,
    profile,
    customerProfile,
    setCustomerProfile,
    role,
    loading,
    isAuthenticated: !!session,
    isAdmin: role === "Admin" || role === "Karyawan",
    isMember: role === "Member",
    signIn,
    signUp,
    signOut,
    refreshProfile: () => loadProfile(user?.id, user?.email)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
