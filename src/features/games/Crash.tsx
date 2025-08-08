import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { useProvablyFair } from "@/context/ProvablyFairContext";
import { crashMultiplier } from "@/lib/provablyFair";
import { toast as sonnerToast } from "@/components/ui/sonner";

function randomCrashPoint() {
  // Inverse exponential distribution; remove ~1% mass at 1.00x for house edge
  const e = 1.0; // shape
  const r = Math.random();
  // 1% instant crash at 1.00x
  if (r < 0.01) return 1.0;
  const u = (r - 0.01) / 0.99; // renormalize
  return 1 / (1 - Math.pow(u, e));
}

export default function Crash() {
  const { spend, reward, selectedCurrency } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [mult, setMult] = useState(1);
  const [running, setRunning] = useState(false);
  const crashAtRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const [cashed, setCashed] = useState(false);
  const { getHashAndIncrement } = useProvablyFair();
  const [rocketPos, setRocketPos] = useState<{ x: number; y: number; angle: number }>({ x: 0, y: 0, angle: -5 });

  function start() {
    if (running) return;
    if (!spend(bet, selectedCurrency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${selectedCurrency}.` });
      return;
    }
    // Provably fair crash point
    const hash = getHashAndIncrement();
    crashAtRef.current = Math.max(1.0, crashMultiplier(hash, 0.01));
    setMult(1);
    setRunning(true);
    setCashed(false);
  }

  useEffect(() => {
    if (!running) return;
    let rafId: number;
    const start = performance.now();
    const duration = 16000; // even slower baseline
    const step = (t: number) => {
      const elapsed = Math.max(0, Math.min(1, (t - start) / duration)); // 0..1
      // Exponential ease-in curve: e^(a*x^2)
      const a = 2.5;
      const expPart = Math.exp(a * elapsed * elapsed) - 1;
      const target = 1 + expPart * 2.0;
      setMult(target);
      // Update rocket position: slight horizontal then accelerate upward
      const x = 20 + elapsed * 260;
      const y = -Math.min(260, (target - 1) * 4.5);
      const angle = -90 + Math.min(85, (elapsed * elapsed) * 120); // start near 90°, then pitch up
      setRocketPos({ x, y, angle });
      if (target < crashAtRef.current) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (mult >= crashAtRef.current) {
      setRunning(false);
      if (!cashed) {
        sonnerToast(`Crashed at x${crashAtRef.current.toFixed(2)}`);
      }
    }
  }, [mult, running, cashed, toast]);

  function cashOut() {
    if (!running || cashed) return;
    const payout = Math.floor(bet * mult);
    reward(payout, selectedCurrency);
    setCashed(true);
    setRunning(false);
    sonnerToast(`Cashed out: x${mult.toFixed(2)} = +${payout.toLocaleString()} ${selectedCurrency}`);
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Crash</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 items-end">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="betc">Bet Amount</label>
                <Input id="betc" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={running} />
              </div>
            </div>
            <div className="flex gap-3">
              {!running ? (
                <Button variant="hero" onClick={start}>Start</Button>
              ) : (
                <Button variant="neon" onClick={cashOut}>Cash Out</Button>
              )}
            </div>
            {running && <span className="text-muted-foreground">Crashed at ~ x{crashAtRef.current.toFixed(2)}</span>}
          </div>
          {/* Right: Graph/Mult */}
          <div className="w-full">
            <div className="h-56 rounded-md border relative overflow-hidden">
              <img src="/images/rocket.png" alt="Rocket" className="absolute left-6 bottom-6 w-10 h-10" style={{ transform: `translate(${rocketPos.x}px, ${rocketPos.y}px) rotate(${rocketPos.angle}deg)` }} />
              <div className="absolute right-4 top-4 text-4xl font-bold">x{mult.toFixed(2)}</div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/30" style={{ width: `${Math.min(100, (mult - 1) * 2)}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
