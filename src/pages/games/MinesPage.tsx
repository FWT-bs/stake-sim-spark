import { SEO } from "@/components/SEO";
import Mines from "@/features/games/Mines";

export default function MinesPage() {
  return (
    <main className="container py-10">
      <SEO title="Play Mines — FunStake Casino" description="Play Mines with your FunCoin or RealCredit balance." />
      <h1 className="text-2xl font-semibold mb-4">Play Mines</h1>
      <Mines />
    </main>
  );
}
