import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useGeo } from "@/context/GeoContext";
import { useProvablyFair } from "@/context/ProvablyFairContext";
import { useWallet } from "@/context/WalletContext";

export default function TopWalletBar() {
  const { selectedCurrency, setSelectedCurrency } = useWallet();
  const { signOut } = useAuth();
  const { status } = useGeo();
  const { clientSeed, setClientSeed, serverSeedHash, rotateServerSeed } = useProvablyFair();
  const { fc, rc } = useWallet();
  const [displayFc, setDisplayFc] = useState<number>(fc);
  const [displayRc, setDisplayRc] = useState<number>(rc);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // smooth count animation by cents (fast)
    const step = () => {
      setDisplayFc((v) => v + Math.sign(fc - v) * Math.min(Math.max(Math.abs(fc - v) / 10, 0.01), Math.abs(fc - v)));
      setDisplayRc((v) => v + Math.sign(rc - v) * Math.min(Math.max(Math.abs(rc - v) / 10, 0.01), Math.abs(rc - v)));
    };
    const id = window.setInterval(step, 30);
    return () => window.clearInterval(id);
  }, [fc, rc]);

  useEffect(() => { setDisplayFc(fc); setDisplayRc(rc); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { setOpenMenu(false); setOpenDeposit(false); } }
    function onClick(e: MouseEvent) {
      if (openMenu && menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(false);
      if (openDeposit && modalRef.current && !modalRef.current.contains(e.target as Node)) setOpenDeposit(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [openMenu, openDeposit]);

  return (
    <div className="ml-auto flex items-center gap-4">
      {/* Profile + dropdown on hover */}
      <div className="relative" ref={menuRef}>
        <button className="h-9 w-9 rounded-full bg-secondary border" aria-label="Profile" onClick={() => setOpenMenu((v) => !v)} />
        {openMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-popover shadow-md">
          <div className="py-2 text-sm">
            <Link to="/profile" className="block px-3 py-2 hover:bg-accent">Profile</Link>
            <button className="w-full text-left px-3 py-2 hover:bg-accent" onClick={() => setOpenDeposit(true)}>Deposit</button>
            <Link to="/redeem" className="block px-3 py-2 hover:bg-accent">Withdraw</Link>
            <Separator className="my-1" />
            <button className="w-full text-left px-3 py-2 hover:bg-accent">Vault</button>
            <button className="w-full text-left px-3 py-2 hover:bg-accent">Transactions</button>
            <button className="w-full text-left px-3 py-2 hover:bg-accent">Support</button>
            <Separator className="my-1" />
            <button className="w-full text-left px-3 py-2 text-destructive hover:bg-destructive/10" onClick={signOut}>Logout</button>
          </div>
        </div>
        )}
      </div>

      {/* Currency toggle pill */}
      <div className="rounded-full border bg-background p-1 flex items-center gap-1">
        <Button size="sm" variant={selectedCurrency === "FC" ? "hero" : "outline"} className="rounded-full" onClick={() => setSelectedCurrency("FC")}>
          FC
        </Button>
        <Button size="sm" variant={selectedCurrency === "RC" ? "hero" : "outline"} className="rounded-full" onClick={() => setSelectedCurrency("RC")}>
          RC
        </Button>
      </div>

      {/* Balances */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">FC</span>
        <span className="font-semibold">{displayFc.toFixed(2)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-muted-foreground">RC</span>
        <span className="font-semibold">{displayRc.toFixed(2)}</span>
      </div>

      {/* + deposit trigger */}
      <button
        className="h-9 w-9 rounded-md bg-yellow-500 text-background font-bold"
        aria-label="Deposit"
        onClick={() => setOpenDeposit(true)}
      >
        +
      </button>

      {/* Anchored deposit panel */}
      {openDeposit && (
        <div className="fixed inset-0 z-30 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-black/50" />
          <Card ref={modalRef} className="relative w-[560px] bg-slate-950/95 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="rounded-full border bg-background/20 p-1">
                  <Button size="sm" variant="hero" className="rounded-full">Purchase</Button>
                  <Button size="sm" variant="outline" className="rounded-full ml-1" asChild>
                    <Link to="/redeem">Redeem Prize</Link>
                  </Button>
                </div>
                <Button size="sm" variant="outline" onClick={() => setOpenDeposit(false)}>Close</Button>
              </div>
              <div className="mb-3 text-xs text-muted-foreground">
                Server Seed Hash: <span className="break-all">{serverSeedHash || '—'}</span>
              </div>
              <div className="mb-3 text-xs flex items-center gap-2">
                <span>Client Seed:</span>
                <input className="h-8 rounded-md border bg-background px-2 text-foreground" value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
                <Button size="sm" variant="outline" onClick={rotateServerSeed}>Rotate Server Seed</Button>
              </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-2">Cryptocurrencies</p>
                  <div className="grid gap-2">
                    {['Litecoin','Ethereum','Solana','Bitcoin','USDC','USDT'].map((x) => (
                      <div key={x} className="rounded-md border bg-background/40 px-3 py-2">{x}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Real Money</p>
                  <div className="grid gap-2">
                    {['Visa','Mastercard','Revolut','Apple Pay','Google Pay','Mercuryo'].map((x) => (
                      <div key={x} className="rounded-md border bg-background/40 px-3 py-2">{x}</div>
                    ))}
                  </div>
                </div>
                {status === 'sweepstakes' && (
                  <button className="col-span-2 mt-2 rounded-md border bg-background/40 px-3 py-2 text-left text-sm" onClick={() => alert('+1 RC earned (mock)')}>Watch an ad to earn RC (mock)</button>
                )}
                  {status === 'sweepstakes' && (
                    <div className="col-span-2 text-xs text-muted-foreground mt-2">
                      RC cannot be directly purchased in your region. FC purchases may include promotional RC gifts.
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


