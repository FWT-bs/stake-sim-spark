import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";

export default function Wallet() {
  const { fc, rc, buyFunCoin, giftRC } = useWallet();
  return (
    <main className="container py-10">
      <SEO title="Wallet — FunStake Casino" description="View your FunCoin and RealCredit balances. Buy FC or claim RC gifts." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>FunCoin (FC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-semibold">{fc.toLocaleString()} FC</p>
            <div className="flex gap-3">
              <Button variant="hero" onClick={() => buyFunCoin(10000)}>Buy +10,000 FC</Button>
              <Button variant="neon" onClick={() => buyFunCoin(50000)}>Buy +50,000 FC</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>RealCredit (RC)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-2xl font-semibold">{rc} RC</p>
            <div className="flex gap-3">
              <Button variant="neon" onClick={() => giftRC(1)}>Get RC Gift +1</Button>
              <Button variant="outline" onClick={() => giftRC(5)}>Get RC Gift +5</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
