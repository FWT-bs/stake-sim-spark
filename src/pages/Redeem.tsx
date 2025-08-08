import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";

export default function Redeem() {
  const { toast } = useToast();
  const { rc, redeemRC } = useWallet();

  function handleRedeem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & { amount: { value: string } };
    const amount = Number(form.amount.value || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid RC amount." });
      return;
    }
    if (amount > rc) {
      toast({ title: "Insufficient RC", description: `You only have ${rc} RC available.` });
      return;
    }
    // RC-only: FunCoin (FC) cannot be redeemed; page only accepts RC
    if (!redeemRC(amount)) {
      toast({ title: "Unable to redeem", description: "Please try again." });
      return;
    }
    toast({ title: "Redeem Requested", description: `We'll process your ${amount} RC reward shortly.` });
    form.reset();
  }

  return (
    <main className="container py-10">
      <SEO title="Redeem — FunStake Casino" description="Redeem your RealCredit (RC) for crypto or gift cards. Mock flow for MVP." />
      <Card className="max-w-xl bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle>Redeem RealCredit (RC)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRedeem} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground" htmlFor="amount">Amount (RC)</label>
              <Input id="amount" name="amount" type="number" min={1} placeholder="e.g. 5" />
            </div>
            <Button type="submit" variant="hero">Request</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-3">RC only. You cannot redeem FunCoin (FC). Mock flow: we simulate processing your reward.</p>
        </CardContent>
      </Card>
    </main>
  );
}
