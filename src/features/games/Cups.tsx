import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useProvablyFair } from "@/context/ProvablyFairContext";
import { outcomeFromHashBits } from "@/lib/provablyFair";
import { calculatePayout } from "@/lib/config";
import { toast as sonnerToast } from "@/components/ui/sonner";

export default function Cups() {
  const { spend, reward, selectedCurrency } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [cups, setCups] = useState(3); // 3–5 cups
  const [choice, setChoice] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const { getHashAndIncrement } = useProvablyFair();

  const payoutMultiplier = calculatePayout(1 / cups);

  function play() {
    if (answer !== null) return;
    if (!spend(bet, selectedCurrency)) { toast({ title: "Insufficient balance", description: `Not enough ${selectedCurrency}.` }); return; }
    const hash = getHashAndIncrement();
    const v = outcomeFromHashBits(hash, 16);
    const winning = v % cups;
    setAnswer(winning);
    const won = winning === choice;
    if (won) {
      const payout = Math.floor(bet * payoutMultiplier);
      const net = payout - bet;
      reward(payout, selectedCurrency);
      sonnerToast(`Won: x${payoutMultiplier.toFixed(2)} = +${net.toLocaleString()} ${selectedCurrency}`);
    } else {
      sonnerToast(`Lost: -${bet.toLocaleString()} ${selectedCurrency}`);
    }
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Cups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 items-end">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="betcp">Bet Amount</label>
                <Input id="betcp" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="cupsc">Cups</label>
                <Input id="cupsc" type="number" min={3} max={5} value={cups} onChange={(e) => setCups(Math.max(3, Math.min(5, Number(e.target.value))))} disabled={answer !== null} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="choice">Choice (0-index)</label>
                <Input id="choice" type="number" min={0} max={cups - 1} value={choice} onChange={(e) => setChoice(Math.max(0, Math.min(cups - 1, Number(e.target.value))))} disabled={answer !== null} />
              </div>
            </div>
            <Button variant="hero" className="w-full" onClick={play} disabled={answer !== null}>Play (x{payoutMultiplier.toFixed(2)})</Button>
          </div>

          {/* Right: Display */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: cups }, (_, i) => (
                <div key={i} className={`h-24 rounded-md border flex items-center justify-center text-2xl ${answer === i ? 'bg-primary/20' : 'bg-secondary/40'}`}>
                  {i === choice ? '🎯' : '🥤'}
                </div>
              ))}
            </div>
            {answer !== null && (
              <div className="mt-2 text-sm text-muted-foreground">Winning cup: {answer}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

