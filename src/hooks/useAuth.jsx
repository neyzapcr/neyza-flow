import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../services/supabaseClient";

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

  // Load profile and customer details by matching userId and email
  const loadProfile = async (userId, userEmail) => {
    setLoading(true);
    try {
      // 1. Link customer account if email matches
      if (userEmail) {
        const { data: existingCust } = await supabase
          .from("customers")
          .select("*")
          .eq("email", userEmail);

        if (existingCust && existingCust.length > 0) {
          const target = existingCust[0];
          if (!target.userId) {
            await supabase
              .from("customers")
              .update({ userId, updatedAt: new Date().toISOString() })
              .eq("id", target.id);
          }
        }
      }

      // 2. Load user details from public.users table using Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      
      const mappedUser = mapUser(data);
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

  // Initialize session from localStorage on application load
  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem("netto_crm_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const mapped = mapUser(parsed);
          setUser(mapped);
          setSession(mapped);
          setProfile(mapped);
          setRole(mapped.role);

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

      // Link customer if match found by email
      const { data: existingCust } = await supabase
        .from("customers")
        .select("*")
        .eq("email", mapped.email);

      if (existingCust && existingCust.length > 0) {
        const target = existingCust[0];
        if (!target.userId) {
          await supabase
            .from("customers")
            .update({ userId: mapped.id, updatedAt: new Date().toISOString() })
            .eq("id", target.id);
        }
      }

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
  const signUp = async ({ email, password, fullName, role = "Member" }) => {
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

      // Link customer to the new user ID if email matches an existing customer (from Quick Order)
      const { data: existingCust } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (existingCust) {
        const { data: updatedCust, error: updateCustErr } = await supabase
          .from("customers")
          .update({
            userId: mapped.id,
            updatedAt: new Date().toISOString()
          })
          .eq("id", existingCust.id)
          .select()
          .single();

        if (updateCustErr) throw updateCustErr;

        setCustomerProfile({
          ...updatedCust,
          customerId: updatedCust.customerCode,
          status: updatedCust.status === "Active" ? "active" : "inactive"
        });
      } else {
        // Create new customer record
        const generatedCustId = `CUST-${String(Math.floor(1000 + Math.random() * 9000))}`;
        const newCust = {
          customerCode: generatedCustId,
          userId: mapped.id,
          customerName: fullName,
          phone: "",
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
