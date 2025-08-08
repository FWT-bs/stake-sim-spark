import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Clean up any limbo auth state before new auth actions
export const cleanupAuthState = () => {
  try {
    // LocalStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        localStorage.removeItem(key);
      }
    });
    // SessionStorage
    Object.keys(sessionStorage || {}).forEach((key) => {
      // @ts-ignore - sessionStorage can be undefined in some environments
      if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {}
};

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    // Then fetch existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: "global" }); } catch {}
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // Full refresh ensures a clean state
    window.location.href = "/";
  };

  const signUp = async (email: string, password: string) => {
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: "global" }); } catch {}
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) throw error;
    // If email confirmations are disabled in Supabase, session will be active immediately
    window.location.href = "/";
  };

  const signOut = async () => {
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: "global" }); } catch {}
    window.location.href = "/auth";
  };

  const value = useMemo(() => ({ user, session, loading, signIn, signUp, signOut }), [user, session, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
