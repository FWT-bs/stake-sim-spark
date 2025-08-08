import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { useMemo, useState } from "react";
import { useProvablyFair } from "@/context/ProvablyFairContext";
import { minesIsBomb } from "@/lib/provablyFair";
import { HOUSE_EDGE } from "@/lib/config";

export default function Mines() {
  const { spend, reward, selectedCurrency } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState(5);
  const [minesCount, setMinesCount] = useState(5);
  const [revealed, setRevealed] = useState<boolean[]>(Array(size * size).fill(false));
  const [mineMap, setMineMap] = useState<boolean[]>([]);
  const { getHashAndIncrement } = useProvablyFair();

  const safeCount = revealed.filter((v, i) => v && !mineMap[i]).length;
  const multiplier = useMemo(() => {
    const totalTiles = size * size;
    const mines = Math.max(1, Math.min(minesCount, totalTiles - 1));
    const base = 1 / (1 - mines / totalTiles);
    const fairnessAdjustment = 1 - HOUSE_EDGE;
    if (safeCount === 0) return 1; // prevent sub-1x before any pick
    return Math.pow(base, safeCount) * fairnessAdjustment;
  }, [safeCount, minesCount, size]);

  function startRound() {
    if (!spend(bet, selectedCurrency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${selectedCurrency}.` });
      return;
    }
    const total = size * size;
    const maxMines = Math.max(1, Math.min(minesCount, total - 1));
    const mines = Array(total).fill(false) as boolean[];
    const hash = getHashAndIncrement();
    for (let i = 0; i < total; i++) {
      if (minesIsBomb(hash, i, total, maxMines)) mines[i] = true;
    }
    // Ensure exact mine count by trimming/adding deterministically
    let current = mines.filter(Boolean).length;
    const indices = Array.from({ length: total }, (_, i) => i);
    let j = 0;
    while (current > maxMines && j < indices.length) { if (mines[j]) { mines[j] = false; current--; } j++; }
    while (current < maxMines && j < indices.length) { if (!mines[j]) { mines[j] = true; current++; } j++; }
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
      sonnerToast(`Lost: -${bet.toLocaleString()} ${selectedCurrency}`);
    }
  }

  function cashOut() {
    const payout = Math.floor(bet * multiplier);
    reward(payout, selectedCurrency);
    setActive(false);
    sonnerToast(`Won: +${payout.toLocaleString()} ${selectedCurrency}`);
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Mines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 items-end">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="betm">Bet Amount</label>
                <Input id="betm" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} disabled={active} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="sizem">Grid Size</label>
                <Input id="sizem" type="number" min={2} max={10} value={size} onChange={(e) => setSize(Math.max(2, Math.min(10, Number(e.target.value))))} disabled={active} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground" htmlFor="minesm">Mines</label>
                <Input id="minesm" type="number" min={1} max={size * size - 1} value={minesCount} onChange={(e) => setMinesCount(Math.max(1, Math.min(size * size - 1, Number(e.target.value))))} disabled={active} />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {!active ? (
                <Button variant="hero" onClick={startRound}>Start Round</Button>
              ) : (
                <Button variant="neon" onClick={cashOut} disabled={safeCount === 0}>Cash Out x{multiplier.toFixed(2)}</Button>
              )}
            </div>
          </div>
          {/* Right: Board */}
          <div className="w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {Array.from({ length: size * size }, (_, i) => (
                <button
                  key={i}
                  className={`w-full aspect-square rounded-md border transition-colors text-lg ${revealed[i] ? (mineMap[i] ? 'bg-destructive/30' : 'bg-primary/20') : 'bg-secondary/40 hover:bg-secondary/60'}`}
                  onClick={() => clickCell(i)}
                  disabled={!active}
                  aria-label={revealed[i] ? (mineMap[i] ? 'Mine' : 'Safe') : 'Hidden cell'}
                >
                  {revealed[i] ? (mineMap[i] ? '💣' : '💎') : '❓'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
