import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Coinflip() {
  const { spend, reward } = useWallet();
  const { toast } = useToast();
  const [bet, setBet] = useState(100);
  const [choice, setChoice] = useState<"Heads" | "Tails">("Heads");
  const [currency, setCurrency] = useState<"FC" | "RC">("FC");

  function play() {
    if (!spend(bet, currency)) {
      toast({ title: "Insufficient balance", description: `Not enough ${currency}.` });
      return;
    }
    const win = Math.random() < 0.5;
    if (win) {
      reward(bet * 2, currency);
      toast({ title: "You won!", description: `+${(bet).toLocaleString()} ${currency}` });
    } else {
      toast({ title: "You lost", description: `-${(bet).toLocaleString()} ${currency}` });
    }
  }

  return (
    <Card className="bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Coinflip</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={choice === "Heads" ? "hero" : "outline"} onClick={() => setChoice("Heads")}>Heads</Button>
          <Button variant={choice === "Tails" ? "hero" : "outline"} onClick={() => setChoice("Tails")}>Tails</Button>
        </div>
        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground" htmlFor="bet">Bet Amount</label>
            <Input id="bet" type="number" min={1} value={bet} onChange={(e) => setBet(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground" htmlFor="currency">Currency</label>
            <select id="currency" className="w-full h-10 rounded-md bg-background border" value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
              <option value="FC">FC</option>
              <option value="RC">RC</option>
            </select>
          </div>
        </div>
        <Button onClick={play} variant="neon" className="w-full">Flip</Button>
      </CardContent>
    </Card>
  );
}
