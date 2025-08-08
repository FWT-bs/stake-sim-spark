import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

function randomCrashPoint() {
  // Exponential-ish distribution around 1-5x
  const r = Math.random();
  return 1 + -Math.log(1 - r) * 1.2;
}

export default function Crash() {
  const { spend, reward } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [currency, setCurrency] = useState<"FC" | "RC">("FC");
  const [mult, setMult] = useState(1);
  const [running, setRunning] = useState(false);
  const crashAtRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const [cashed, setCashed] = useState(false);

  function start() {
    if (running) return;
    if (!spend(bet, currency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${currency}.` });
      return;
    }
    crashAtRef.current = randomCrashPoint();
    setMult(1);
    setRunning(true);
    setCashed(false);
  }

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setMult((m) => m + 0.02);
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (mult >= crashAtRef.current) {
      setRunning(false);
      if (!cashed) {
        toast({ title: "Crashed!", description: `Plane crashed at x${crashAtRef.current.toFixed(2)}` });
      }
    }
  }, [mult, running, cashed, toast]);

  function cashOut() {
    if (!running || cashed) return;
    const payout = Math.floor(bet * mult);
    reward(payout, currency);
    setCashed(true);
    setRunning(false);
    toast({ title: "Cashed out!", description: `x${mult.toFixed(2)} = +${payout.toLocaleString()} ${currency}` });
  }

  return (
    <Card className="bg-card/60 backdrop-blur aspect-square">
      <CardHeader>
        <CardTitle>Crash</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground" htmlFor="betc">Bet Amount</label>
            <Input id="betc" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="currc">Currency</label>
            <select id="currc" className="w-full h-10 rounded-md bg-background border" value={currency} onChange={(e) => setCurrency(e.target.value as any)} disabled={running}>
              <option value="FC">FC</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        <div className="h-24 rounded-md border flex items-center justify-center text-3xl font-bold">
          x{mult.toFixed(2)}
        </div>
        <div className="flex gap-3">
          {!running ? (
            <Button variant="hero" onClick={start}>Start</Button>
          ) : (
            <Button variant="neon" onClick={cashOut}>Cash Out</Button>
          )}
          {running && <span className="text-muted-foreground">Crashed at ~ x{crashAtRef.current.toFixed(2)}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
