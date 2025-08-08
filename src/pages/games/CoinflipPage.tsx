import { SEO } from "@/components/SEO";
import Coinflip from "@/features/games/Coinflip";

export default function CoinflipPage() {
  return (
    <main className="container py-10">
      <SEO title="Play Coinflip — FunStake Casino" description="Flip a coin and try your luck with FunCoin or RealCredit." />
      <h1 className="text-2xl font-semibold mb-4">Play Coinflip</h1>
      <Coinflip />
    </main>
  );
}
