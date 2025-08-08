import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

type CardV = { rank: number; suit: string };

function drawCard(deck: CardV[]): [CardV, CardV[]] {
  const idx = Math.floor(Math.random() * deck.length);
  const card = deck[idx];
  const next = deck.slice(0, idx).concat(deck.slice(idx + 1));
  return [card, next];
}

function handValue(hand: CardV[]) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.rank > 10) total += 10;
    else if (c.rank === 1) { total += 11; aces++; }
    else total += c.rank;
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

export default function Blackjack() {
  const { spend, reward } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [currency, setCurrency] = useState<"FC" | "RC">("FC");
  const [deck, setDeck] = useState<CardV[]>([]);
  const [player, setPlayer] = useState<CardV[]>([]);
  const [dealer, setDealer] = useState<CardV[]>([]);
  const [active, setActive] = useState(false);

  const pVal = useMemo(() => handValue(player), [player]);
  const dVal = useMemo(() => handValue(dealer), [dealer]);

  function newDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const d: CardV[] = [];
    for (let s of suits) for (let r = 1; r <= 13; r++) d.push({ rank: r, suit: s });
    return d;
  }

  function start() {
    if (!spend(bet, currency)) { toast({ title: "Insufficient balance" }); return; }
    let d = newDeck();
    let p: CardV[] = [];
    let dl: CardV[] = [];
    [p[0], d] = drawCard(d); [dl[0], d] = drawCard(d);
    [p[1], d] = drawCard(d); [dl[1], d] = drawCard(d);
    setDeck(d); setPlayer(p); setDealer(dl); setActive(true);
  }

  function hit() {
    if (!active) return;
    let d = deck.slice();
    let p = player.slice();
    let c: CardV; [c, d] = drawCard(d); p.push(c);
    setDeck(d); setPlayer(p);
    if (handValue(p) > 21) { setActive(false); toast({ title: "Bust!" }); }
  }

  function stand() {
    if (!active) return;
    let d = deck.slice();
    let dl = dealer.slice();
    while (handValue(dl) < 17) { let c: CardV; [c, d] = drawCard(d); dl.push(c); }
    setDeck(d); setDealer(dl); setActive(false);
    const pv = handValue(player); const dv = handValue(dl);
    if (dv > 21 || pv > dv) { reward(Math.floor(bet * 2), currency); toast({ title: "You win!", description: `+${bet.toLocaleString()} ${currency}` }); }
    else if (pv === dv) { reward(bet, currency); toast({ title: "Push", description: `Bet returned` }); }
    else { toast({ title: "Dealer wins" }); }
  }

  const renderCard = (c: CardV, i: number) => (
    <div key={i} className="w-10 h-14 border rounded-md flex items-center justify-center bg-secondary/40">{c.rank === 1 ? 'A' : c.rank > 10 ? ['J','Q','K'][c.rank-11] : c.rank}{c.suit}</div>
  );

  return (
    <Card className="bg-card/60 backdrop-blur aspect-square">
      <CardHeader>
        <CardTitle>Blackjack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground" htmlFor="betb">Bet Amount</label>
            <Input id="betb" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="currb">Currency</label>
            <select id="currb" className="w-full h-10 rounded-md bg-background border" value={currency} onChange={(e) => setCurrency(e.target.value as any)} disabled={active}>
              <option value="FC">FC</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-2">Dealer ({dVal})</div>
          <div className="flex gap-2 mb-4">{dealer.map(renderCard)}</div>
          <div className="text-sm text-muted-foreground mb-2">You ({pVal})</div>
          <div className="flex gap-2 mb-4">{player.map(renderCard)}</div>
        </div>
        <div className="flex gap-3">
          {!active ? (
            <Button variant="hero" onClick={start}>Deal</Button>
          ) : (
            <>
              <Button variant="neon" onClick={hit}>Hit</Button>
              <Button variant="outline" onClick={stand}>Stand</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
