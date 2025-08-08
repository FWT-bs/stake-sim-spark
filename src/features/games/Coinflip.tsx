import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { useProvablyFair } from "@/context/ProvablyFairContext";
import { coinflipOutcome } from "@/lib/provablyFair";
import { calculatePayout } from "@/lib/config";
import { toast as sonnerToast } from "@/components/ui/sonner";

export default function Coinflip() {
  const { spend, reward, selectedCurrency } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [choice, setChoice] = useState<"Heads" | "Tails">("Heads");
  const { getHashAndIncrement } = useProvablyFair();
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastOutcome, setLastOutcome] = useState<"Heads" | "Tails" | null>(null);
  const coinRef = useRef<HTMLDivElement | null>(null);

  function play() {
    if (isFlipping) return;
    if (!spend(bet, selectedCurrency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${selectedCurrency}.` });
      return;
    }
    const fairOdds = 0.5;
    const payoutMultiplier = calculatePayout(fairOdds);
    // Determine animation target outcome first
    const hash = getHashAndIncrement();
    const provablyFairOutcome = coinflipOutcome(hash);
    const outcome = provablyFairOutcome; // animate to this
    const win = outcome === choice;
    setIsFlipping(true);
    setLastOutcome(null);
    // Animate a real 3D flip that lands on the decided outcome
    const spins = 6; // full rotations
    const finalDeg = spins * 360 + (outcome === "Heads" ? 0 : 180);
    const el = coinRef.current;
    if (el) {
      el.style.transition = "none";
      el.style.transform = "rotateY(0deg)";
      // force reflow
      void el.offsetWidth;
      el.style.transition = "transform 1000ms cubic-bezier(0.2, 0.6, 0.2, 1)";
      el.style.transform = `rotateY(${finalDeg}deg)`;
    }
    window.setTimeout(() => {
      setIsFlipping(false);
      setLastOutcome(outcome);
      // Settle result
      if (win) {
        const payout = Math.floor(bet * payoutMultiplier);
        const netWin = payout - bet;
        reward(payout, selectedCurrency);
        sonnerToast(`Won: x${payoutMultiplier.toFixed(2)} = +${netWin.toLocaleString()} ${selectedCurrency}`);
      } else {
        sonnerToast(`Lost: -${bet.toLocaleString()} ${selectedCurrency}`);
      }
    }, 1000);
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Coinflip</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant={choice === "Heads" ? "hero" : "outline"} onClick={() => setChoice("Heads")}>Heads</Button>
              <Button variant={choice === "Tails" ? "hero" : "outline"} onClick={() => setChoice("Tails")}>Tails</Button>
            </div>
            <div className="grid grid-cols-1 gap-3 items-end">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="bet">Bet Amount</label>
                <Input id="bet" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={isFlipping} />
              </div>
            </div>
            <Button onClick={play} variant="hero" className="w-full">Flip</Button>
          </div>
          {/* Right: Visual */}
          <div className="w-full">
            <div className="h-56 rounded-md border flex flex-col items-center justify-center gap-4">
              <div className="coin3d" ref={coinRef} aria-live="polite" aria-label={lastOutcome ?? "Coin"}>
                <div className="face front">Heads</div>
                <div className="face back">Tails</div>
              </div>
              <div className="text-xs text-muted-foreground">Outcome: {lastOutcome ?? (isFlipping ? "Flipping..." : "—")}</div>
            </div>
            <style>
              {`
              .coin3d { width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle at 50% 30%, #facc15 40%, #d97706 70%); border: 2px solid #b45309; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transform-style: preserve-3d; transform: rotateY(0deg); }
              .face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #111827; font-size: 18px; text-transform: uppercase; }
              .front { transform: rotateY(0deg); }
              .back { transform: rotateY(180deg); }
              `}
            </style>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
