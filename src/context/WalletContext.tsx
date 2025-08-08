/* @refresh reset */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Currency = "FC" | "RC";

type WalletContextType = {
  fc: number;
  rc: number;
  isUnlimited: boolean;
  selectedCurrency: Currency;
  setSelectedCurrency: (c: Currency) => void;
  totalWagered: number;
  totalDeposited: number;
  totalWithdrawn: number;
  spend: (amount: number, currency: Currency) => boolean;
  reward: (amount: number, currency: Currency) => void;
  buyFunCoin: (amount: number) => void;
  giftRC: (amount: number) => void;
  redeemRC: (amount: number) => boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEY = "funstake_wallet";

const defaults = {
  fc: 0,
  rc: 0,
  selectedCurrency: "FC" as Currency,
  totalWagered: 0,
  totalDeposited: 0,
  totalWithdrawn: 0,
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [fc, setFc] = useState<number>(defaults.fc);
  const [rc, setRc] = useState<number>(defaults.rc);
  const [isUnlimited, setIsUnlimited] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(defaults.selectedCurrency);
  const [totalWagered, setTotalWagered] = useState<number>(defaults.totalWagered);
  const [totalDeposited, setTotalDeposited] = useState<number>(defaults.totalDeposited);
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(defaults.totalWithdrawn);
  const { session } = useAuth();

  const VIP_EMAILS = new Set(["almostfelixwu@gmail.com"]);
  const LARGE_BALANCE = 9_999_999_999;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.fc === "number") setFc(parsed.fc);
        if (typeof parsed.rc === "number") setRc(parsed.rc);
        if (parsed.selectedCurrency === "FC" || parsed.selectedCurrency === "RC") setSelectedCurrency(parsed.selectedCurrency);
        if (typeof parsed.totalWagered === "number") setTotalWagered(parsed.totalWagered);
        if (typeof parsed.totalDeposited === "number") setTotalDeposited(parsed.totalDeposited);
        if (typeof parsed.totalWithdrawn === "number") setTotalWithdrawn(parsed.totalWithdrawn);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch {}
  }, []);

  // Enable unlimited balances for VIP emails
  useEffect(() => {
    const email = session?.user?.email || null;
    const unlimited = !!(email && VIP_EMAILS.has(email));
    setIsUnlimited(unlimited);
    if (unlimited) {
      setFc(LARGE_BALANCE);
      setRc(LARGE_BALANCE);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fc, rc, selectedCurrency, totalWagered, totalDeposited, totalWithdrawn })
    );
  }, [fc, rc, selectedCurrency, totalWagered, totalDeposited, totalWithdrawn]);

  const api = useMemo<WalletContextType>(() => ({
    fc,
    rc,
    isUnlimited,
    selectedCurrency,
    setSelectedCurrency,
    totalWagered,
    totalDeposited,
    totalWithdrawn,
    spend: (amount, currency) => {
      amount = Math.max(0, Math.floor(amount));
      if (isUnlimited) {
        setTotalWagered((v) => v + amount);
        return true;
      }
      if (currency === "FC") {
        if (fc < amount) return false;
        setFc((v) => v - amount);
        setTotalWagered((v) => v + amount);
        return true;
      } else {
        if (rc < amount) return false;
        setRc((v) => v - amount);
        setTotalWagered((v) => v + amount);
        return true;
      }
    },
    reward: (amount, currency) => {
      amount = Math.max(0, Math.floor(amount));
      if (isUnlimited) return; // no-op
      if (currency === "FC") setFc((v) => v + amount);
      else setRc((v) => v + amount);
    },
    buyFunCoin: (amount) => {
      if (isUnlimited) return;
      const amt = Math.max(0, Math.floor(amount));
      setFc((v) => v + amt);
      setTotalDeposited((v) => v + 0); // FC is play money; not counted as real deposit
    },
    giftRC: (amount) => {
      if (isUnlimited) return;
      const amt = Math.max(0, Math.floor(amount));
      setRc((v) => v + amt);
      setTotalDeposited((v) => v + 0); // Gifts not counted as deposit
    },
    redeemRC: (amount) => {
      const amt = Math.max(0, Math.floor(amount));
      if (isUnlimited) return true;
      if (rc < amt) return false;
      setRc((v) => v - amt);
      setTotalWithdrawn((v) => v + amt);
      return true;
    },
  }), [fc, rc, isUnlimited, selectedCurrency, totalWagered, totalDeposited, totalWithdrawn]);

  return <WalletContext.Provider value={api}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
