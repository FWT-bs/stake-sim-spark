import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Currency = "FC" | "RC";

type WalletContextType = {
  fc: number;
  rc: number;
  spend: (amount: number, currency: Currency) => boolean;
  reward: (amount: number, currency: Currency) => void;
  buyFunCoin: (amount: number) => void;
  giftRC: (amount: number) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = "funstake_wallet";

const defaults = { fc: 50000, rc: 5 };

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [fc, setFc] = useState<number>(defaults.fc);
  const [rc, setRc] = useState<number>(defaults.rc);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.fc === "number") setFc(parsed.fc);
        if (typeof parsed.rc === "number") setRc(parsed.rc);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fc, rc }));
  }, [fc, rc]);

  const api = useMemo<WalletContextType>(() => ({
    fc,
    rc,
    spend: (amount, currency) => {
      amount = Math.max(0, Math.floor(amount));
      if (currency === "FC") {
        if (fc < amount) return false;
        setFc((v) => v - amount);
        return true;
      } else {
        if (rc < amount) return false;
        setRc((v) => v - amount);
        return true;
      }
    },
    reward: (amount, currency) => {
      amount = Math.max(0, Math.floor(amount));
      if (currency === "FC") setFc((v) => v + amount);
      else setRc((v) => v + amount);
    },
    buyFunCoin: (amount) => setFc((v) => v + Math.max(0, Math.floor(amount))),
    giftRC: (amount) => setRc((v) => v + Math.max(0, Math.floor(amount))),
  }), [fc, rc]);

  return <WalletContext.Provider value={api}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
