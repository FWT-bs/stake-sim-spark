import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

const SIZE = 5;
const MINES = 5;

export default function Mines() {
  const { spend, reward } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [currency, setCurrency] = useState<"FC" | "RC">("FC");
  const [active, setActive] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(SIZE * SIZE).fill(false));
  const [mineMap, setMineMap] = useState<boolean[]>([]);

  const safeCount = revealed.filter((v, i) => v && !mineMap[i]).length;
  const multiplier = useMemo(() => 1 + safeCount * 0.2, [safeCount]);

  function startRound() {
    if (!spend(bet, currency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${currency}.` });
      return;
    }
    const mines = Array(SIZE * SIZE).fill(false);
    let planted = 0;
    while (planted < MINES) {
      const i = Math.floor(Math.random() * mines.length);
      if (!mines[i]) { mines[i] = true; planted++; }
    }
    setMineMap(mines);
    setRevealed(Array(SIZE * SIZE).fill(false));
    setActive(true);
  }

  function clickCell(i: number) {
    if (!active || revealed[i]) return;
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
    if (mineMap[i]) {
      setActive(false);
      toast({ title: "Boom!", description: `You hit a mine. -${bet.toLocaleString()} ${currency}` });
    }
  }

  function cashOut() {
    const payout = Math.floor(bet * multiplier);
    reward(payout, currency);
    setActive(false);
    toast({ title: "Cashed out!", description: `+${payout.toLocaleString()} ${currency}` });
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Mines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground" htmlFor="betm">Bet Amount</label>
            <Input id="betm" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="currm">Currency</label>
            <select id="currm" className="w-full h-10 rounded-md bg-background border" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
              <option value="FC">FC</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <button
              key={i}
              className={`h-12 rounded-md border transition-colors ${revealed[i] ? (mineMap[i] ? 'bg-destructive/30' : 'bg-primary/20') : 'bg-secondary/40 hover:bg-secondary/60'}`}
              onClick={() => clickCell(i)}
              disabled={!active}
            />
          ))}
        </div>
        <div className="flex gap-3">
          {!active ? (
            <Button variant="hero" onClick={startRound}>Start Round</Button>
          ) : (
            <>
              <Button variant="neon" onClick={cashOut}>Cash Out x{multiplier.toFixed(2)}</Button>
              <Button variant="outline" onClick={() => { setActive(false); toast({ title: "Round canceled" }); }}>Cancel</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
