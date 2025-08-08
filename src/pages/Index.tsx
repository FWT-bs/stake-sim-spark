import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useWallet } from "@/context/WalletContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { fc, rc } = useWallet();
  return (
    <main className="min-h-screen relative overflow-hidden">
      <SEO title="FunStake Casino — Play Mines, Crash, Coinflip" description="Stake-style crypto casino using FunCoin. Play Mines, Crash, Coinflip and Blackjack with instant feedback." />

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center animate-enter">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            FunStake Casino
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Slick, fast, and addictive. Play with FunCoin — no wallet required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/games">
              <Button variant="hero" size="lg">Play Games</Button>
            </Link>
            <Link to="/wallet">
              <Button variant="neon" size="lg">Wallet</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-16">
          <Card className="bg-card/60 backdrop-blur border-border/40">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">FunCoin Balance</p>
              <p className="text-2xl font-semibold">{fc.toLocaleString()} FC</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur border-border/40">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">RealCredit</p>
              <p className="text-2xl font-semibold">{rc.toLocaleString()} RC</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur border-border/40">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Hot Games</p>
              <p className="text-2xl font-semibold">Mines • Crash • Coinflip</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute -inset-40 bg-[radial-gradient(80%_50%_at_50%_0%,hsl(var(--primary)/.25),transparent_60%)]" />
      </div>
    </main>
  );
};

export default Index;
