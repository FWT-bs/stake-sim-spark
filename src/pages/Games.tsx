import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Coinflip from "@/features/games/Coinflip";
import Mines from "@/features/games/Mines";
import Crash from "@/features/games/Crash";
import Blackjack from "@/features/games/Blackjack";

const Placeholder = ({ title }: { title: string }) => (
  <Card className="bg-card/60 backdrop-blur">
    <CardHeader>
      <CardTitle>{title} (Coming Soon)</CardTitle>
    </CardHeader>
    <CardContent className="text-muted-foreground">Stay tuned!</CardContent>
  </Card>
);

export default function Games() {
  return (
    <main className="container py-10">
      <SEO title="Games — FunStake Casino" description="Play Mines, Crash, Coinflip and Blackjack with your FunCoin balance." />
      <div className="grid gap-6 md:grid-cols-2">
        <Coinflip />
        <Mines />
        <Crash />
        <Blackjack />
        <Placeholder title="Roulette" />
        <Placeholder title="Slots" />
        <Placeholder title="Cups" />
        <Placeholder title="High / Low" />
      </div>
    </main>
  );
}
