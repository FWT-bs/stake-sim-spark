import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { generateServerSeed, hashServerSeed, hmacSHA256 } from "@/lib/provablyFair";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type ProvablyFairContextType = {
  clientSeed: string;
  setClientSeed: (v: string) => void;
  serverSeedHash: string;
  rotateServerSeed: () => void; // generates a new server seed and resets nonce
  nonce: number;
  getHashAndIncrement: () => string; // produces HMAC for current round, then increments nonce
};

const ProvablyFairContext = createContext<ProvablyFairContextType | undefined>(undefined);

const SERVER_SEED_KEY = "pf_server_seed";

export function ProvablyFairProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [clientSeed, setClientSeed] = useState<string>("user-seed");
  const [serverSeed, setServerSeed] = useState<string>("");
  const [serverSeedHash, setServerSeedHash] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);

  // Load server seed from local storage (kept secret client-side)
  useEffect(() => {
    try {
      const s = localStorage.getItem(SERVER_SEED_KEY);
      if (s) {
        setServerSeed(s);
        setServerSeedHash(hashServerSeed(s));
      } else {
        const ns = generateServerSeed();
        setServerSeed(ns);
        setServerSeedHash(hashServerSeed(ns));
        localStorage.setItem(SERVER_SEED_KEY, ns);
      }
    } catch {}
  }, []);

  // Load clientSeed/nonce from Supabase user metadata if available
  useEffect(() => {
    (async () => {
      if (!session) return;
      const meta = session.user.user_metadata || {};
      if (typeof meta.clientSeed === "string") setClientSeed(meta.clientSeed);
      if (typeof meta.nonce === "number") setNonce(meta.nonce);
    })();
  }, [session]);

  const rotateServerSeed = () => {
    const ns = generateServerSeed();
    setServerSeed(ns);
    setServerSeedHash(hashServerSeed(ns));
    setNonce(0);
    try { localStorage.setItem(SERVER_SEED_KEY, ns); } catch {}
  };

  const getHashAndIncrement = () => {
    const h = hmacSHA256(serverSeed, `${clientSeed}:${nonce}`);
    setNonce((v) => v + 1);
    // Persist nonce and clientSeed to Supabase user metadata if logged in
    (async () => { try { await supabase.auth.updateUser({ data: { nonce: nonce + 1, clientSeed } }); } catch {} })();
    return h;
  };

  const value = useMemo<ProvablyFairContextType>(() => ({
    clientSeed,
    setClientSeed,
    serverSeedHash,
    rotateServerSeed,
    nonce,
    getHashAndIncrement,
  }), [clientSeed, serverSeedHash, nonce]);

  return <ProvablyFairContext.Provider value={value}>{children}</ProvablyFairContext.Provider>;
}

export function useProvablyFair() {
  const ctx = useContext(ProvablyFairContext);
  if (!ctx) throw new Error("useProvablyFair must be used within ProvablyFairProvider");
  return ctx;
}


