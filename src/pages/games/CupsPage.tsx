import { SEO } from "@/components/SEO";
import Cups from "@/features/games/Cups";

export default function CupsPage() {
  return (
    <main className="container py-10">
      <SEO title="Play Cups — FunStake Casino" description="Pick the right cup and win." />
      <h1 className="text-2xl font-semibold mb-4">Play Cups</h1>
      <Cups />
    </main>
  );
}


