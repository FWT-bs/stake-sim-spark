import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

export default function Mines() {
  const { spend, reward } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [currency, setCurrency] = useState<"FC" | "RC">("FC");
  const [active, setActive] = useState(false);
  const [size, setSize] = useState(5);
  const [minesCount, setMinesCount] = useState(5);
  const [revealed, setRevealed] = useState<boolean[]>(Array(size * size).fill(false));
  const [mineMap, setMineMap] = useState<boolean[]>([]);

  const safeCount = revealed.filter((v, i) => v && !mineMap[i]).length;
  const multiplier = useMemo(() => 1 + safeCount * 0.2, [safeCount]);

  function startRound() {
    if (!spend(bet, currency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${currency}.` });
      return;
    }
    const mines = Array(size * size).fill(false);
    let planted = 0;
    const maxMines = Math.max(1, Math.min(minesCount, size * size - 1));
    while (planted < maxMines) {
      const i = Math.floor(Math.random() * mines.length);
      if (!mines[i]) { mines[i] = true; planted++; }
    }
    setMineMap(mines);
    setRevealed(Array(size * size).fill(false));
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
    <Card className="bg-card/60 backdrop-blur aspect-square">
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
            <select id="currm" className="w-full h-10 rounded-md bg-background border" value={currency} onChange={(e) => setCurrency(e.target.value as any)} disabled={active}>
              <option value="FC">FC</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="sizem">Grid Size</label>
            <Input id="sizem" type="number" min={3} max={10} value={size} onChange={(e) => setSize(Math.max(3, Math.min(10, Number(e.target.value))))} disabled={active} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="minesm">Mines</label>
            <Input id="minesm" type="number" min={1} max={size * size - 1} value={minesCount} onChange={(e) => setMinesCount(Math.max(1, Math.min(size * size - 1, Number(e.target.value))))} disabled={active} />
          </div>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
          {Array.from({ length: size * size }, (_, i) => (
            <button
              key={i}
              className={`h-12 rounded-md border transition-colors ${revealed[i] ? (mineMap[i] ? 'bg-destructive/30' : 'bg-primary/20') : 'bg-secondary/40 hover:bg-secondary/60'}`}
              onClick={() => clickCell(i)}
              disabled={!active}
              aria-label={revealed[i] ? (mineMap[i] ? 'Mine' : 'Safe') : 'Hidden cell'}
            >
              {revealed[i] ? (mineMap[i] ? '💣' : '💎') : '❓'}
            </button>
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
