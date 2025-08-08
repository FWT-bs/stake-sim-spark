import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { generateServerSeed, hashServerSeed, hmacSHA256 } from "@/lib/provablyFair";

const KEY = "funstake_pf";

export default function ProvablyFairPanel() {
  const [clientSeed, setClientSeed] = useState<string>("user-seed");
  const [serverSeed, setServerSeed] = useState<string>("");
  const [serverSeedHash, setServerSeedHash] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved.clientSeed) setClientSeed(saved.clientSeed);
      if (saved.serverSeed) setServerSeed(saved.serverSeed);
      if (saved.serverSeedHash) setServerSeedHash(saved.serverSeedHash);
      if (typeof saved.nonce === 'number') setNonce(saved.nonce);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ clientSeed, serverSeed, serverSeedHash, nonce })); } catch {}
  }, [clientSeed, serverSeed, serverSeedHash, nonce]);

  function newServerSeed() {
    const s = generateServerSeed();
    setServerSeed(s);
    setServerSeedHash(hashServerSeed(s));
    setNonce(0);
  }

  return (
    <div className="fixed left-4 bottom-4 z-40">
      <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>Provably Fair</Button>
      {open && (
        <Card className="mt-2 w-[420px] bg-card/90 backdrop-blur">
          <CardContent className="p-4 space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Server Seed (hash before round)</div>
              <div className="rounded-md border bg-background/40 px-2 py-1 break-all">{serverSeedHash || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Client Seed</div>
              <input className="w-full h-9 rounded-md border bg-background px-2" value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Nonce: {nonce}</div>
              <Button size="sm" onClick={newServerSeed}>New Server Seed</Button>
            </div>
            <div className="text-xs text-muted-foreground">For each round: HMAC_SHA256(serverSeed, `${clientSeed}:${nonce}`)</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function computeRoundHash(serverSeed: string, clientSeed: string, nonce: number): string {
  return hmacSHA256(serverSeed, `${clientSeed}:${nonce}`);
}


