import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";

export default function Profile() {
  const { totalWagered, totalDeposited, totalWithdrawn, fc, rc } = useWallet();
  return (
    <main className="container py-10">
      <SEO title="Profile — FunStake" description="Your profile and lifetime statistics." />
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>Lifetime Wagered</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalWagered.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>Total Deposited</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalDeposited.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>Total Withdrawn</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalWithdrawn.toLocaleString()}</p></CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>FunCoin (FC)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{fc.toLocaleString()} FC</p></CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader><CardTitle>RealCredit (RC)</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{rc} RC</p></CardContent>
        </Card>
      </div>
    </main>
  );
}


