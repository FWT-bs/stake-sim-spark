import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { toast as sonnerToast } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Flame, Crown, Users, Gamepad2, Search, Trophy, Swords } from "lucide-react";

const trendingGames = [
  { id: "olympus", name: "Gates of Olympus", players: 241, rank: 1, exclusive: false },
  { id: "bonanza", name: "Sweet Bonanza", players: 198, rank: 2, exclusive: false },
  { id: "sugar", name: "Sugar Rush", players: 176, rank: 3, exclusive: true },
  { id: "zeus", name: "Power of Zeus", players: 162, rank: 4, exclusive: false },
  { id: "fruits", name: "Fruits Deluxe", players: 151, rank: 5, exclusive: false },
  { id: "gems", name: "Gems Fortune", players: 127, rank: 6, exclusive: false },
  { id: "magic", name: "Mystic Magic", players: 109, rank: 7, exclusive: false },
  { id: "pirates", name: "Pirates Bay", players: 94, rank: 8, exclusive: false },
];

const originals = [
  { id: "mines", name: "Mines", tag: "EXCLUSIVE", to: "/games/mines" },
  { id: "crash", name: "Crash", multiplier: "7.0x", to: "/games/crash" },
  { id: "coinflip", name: "Coinflip", tag: "EXCLUSIVE", to: "/games/coinflip" },
  { id: "blackjack", name: "Blackjack", to: "/games/blackjack" },
];

function Tile({ label, glow, count }: { label: string; glow: "blue" | "green"; count: number }) {
  const glowCls = glow === "blue" ? "from-primary/30 to-transparent" : "from-emerald-500/30 to-transparent";
  return (
    <Card className="relative overflow-hidden bg-card/60 backdrop-blur border-border/40 hover-scale">
      <CardContent className="p-6 h-40 flex flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold mt-1">Featured</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary/70" />
          <span>{count.toLocaleString()} playing</span>
        </div>
      </CardContent>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${glowCls}`} aria-hidden />
    </Card>
  );
}

function GameCard({ game }: { game: typeof trendingGames[number] }) {
  return (
    <div className="pr-3">
      <Card className="bg-card/60 backdrop-blur border-border/40 hover-scale">
        <CardContent className="p-0">
          <div className="relative aspect-[1/1.35] overflow-hidden rounded-md">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
            <div className="absolute left-2 top-2 flex items-center gap-2">
              <Badge variant="secondary">#{game.rank}</Badge>
              {game.exclusive && <Badge variant="outline">EXCLUSIVE</Badge>}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <p className="font-medium">{game.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block h-2 w-2 rounded-full bg-primary/70" />
                {game.players}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Index() {
  const { reward } = useWallet();
  const { session } = useAuth();
  function enterGuestMode() {
    if (session) { sonnerToast("Already signed in"); return; }
    reward(500, "FC");
    reward(500, "RC");
    sonnerToast("Guest mode: +500 FC, +500 RC added");
    try { localStorage.setItem("funstake_guest", "1"); } catch {}
  }
  return (
    <main className="min-h-screen relative overflow-hidden">
      <SEO title="FunStake — Crypto Casino & Poker Games Online" description="Play at FunStake: trending games, Stake-style originals, and a live leaderboard. Fast, sleek, and fun." />

      <section className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center animate-enter">
          <article>
             <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">EzGame — World’s Largest Online Casino and Poker</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">Lightning-fast gameplay. Beautiful design. Built for the FunStake community.</p>
            <div className="flex items-center gap-4 mb-4">
              <Link to="/auth"><Button variant="hero" size="lg">Register</Button></Link>
              <Link to="/auth"><Button variant="outline" size="lg">Login</Button></Link>
              <Button variant="neon" size="lg" onClick={enterGuestMode}>Guest Mode</Button>
            </div>
            <p className="text-xs text-muted-foreground">This site is in testing mode. No monetary value is earned or taken.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Or sign up with</span>
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5" />
                <Gamepad2 className="h-5 w-5" />
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </article>
          <aside className="grid grid-cols-2 gap-4">
            <Tile label="Casino" glow="blue" count={14193} />
            <Tile label="Poker" glow="green" count={8621} />
          </aside>
        </div>
      </section>

      <section className="container pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 h-12" placeholder="Search your game" aria-label="Search your game" />
        </div>
      </section>

      <section className="container py-8">
        <header className="flex items-center gap-2 mb-4">
          <Flame className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Trending Games</h2>
        </header>
        <Carousel>
          <CarouselContent>
            {trendingGames.map((g) => (
              <CarouselItem key={g.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                <GameCard game={g} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="container py-8">
        <header className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-primary" />
           <h2 className="text-xl font-semibold">EzGame Originals</h2>
        </header>
        <Carousel>
          <CarouselContent>
            {originals.map((g) => (
              <CarouselItem key={g.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
                <Link to={g.to}>
                  <Card className="bg-card/60 backdrop-blur border-border/40 hover-scale">
                    <CardContent className="p-4 aspect-[1/1.1] flex flex-col justify-between">
                      <div className="flex items-center justify-between text-sm">
                        {g.tag ? <Badge variant="outline">{g.tag}</Badge> : <span />}
                        {g.multiplier && (
                          <div className="text-xs text-muted-foreground">{g.multiplier}</div>
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{g.name}</p>
                        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Active now
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="container py-10">
        <header className="flex items-center gap-2 mb-4">
          <Swords className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Race Leaderboard</h2>
        </header>
        <Card className="bg-card/60 backdrop-blur border-border/40">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Game</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Multiplier</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1,2,3,4,5,6].map((i) => (
                  <TableRow key={i} className={i % 2 ? "" : "bg-muted/40"}>
                    <TableCell className="font-medium flex items-center gap-2"><Gamepad2 className="h-4 w-4" /> Crash</TableCell>
                    <TableCell className="text-muted-foreground">Hidden</TableCell>
                    <TableCell>10:{10 + i} PM</TableCell>
                    <TableCell className="text-right">{(50000 * i).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(Math.random()*5+0.5).toFixed(2)}x</TableCell>
                    <TableCell className="text-right">{i % 2 ? "+" : "-"}{(Math.random()*1000).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <div className="absolute -inset-40 bg-[radial-gradient(80%_50%_at_50%_0%,hsl(var(--primary)/.25),transparent_60%)]" />
      </div>
    </main>
  );
}
