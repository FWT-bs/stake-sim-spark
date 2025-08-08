import { SEO } from "@/components/SEO";
import Crash from "@/features/games/Crash";

export default function CrashPage() {
  return (
    <main className="container py-10">
      <SEO title="Play Crash — FunStake Casino" description="Play Crash and cash out before it crashes." />
      <h1 className="text-2xl font-semibold mb-4">Play Crash</h1>
      <Crash />
    </main>
  );
}
