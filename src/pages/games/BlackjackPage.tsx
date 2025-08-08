import { SEO } from "@/components/SEO";
import Blackjack from "@/features/games/Blackjack";

export default function BlackjackPage() {
  return (
    <main className="container py-10">
      <SEO title="Play Blackjack — FunStake Casino" description="Play Blackjack against the dealer with FunCoin or RealCredit." />
      <h1 className="text-2xl font-semibold mb-4">Play Blackjack</h1>
      <Blackjack />
    </main>
  );
}
